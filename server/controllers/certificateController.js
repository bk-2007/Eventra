const Certificate = require('../models/Certificate');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const PDFDocument = require('pdfkit');

// Generate Certificate (Admin triggers)
exports.generateCertificate = async (req, res) => {
  const { studentId, eventId, certificateType, position } = req.body;

  try {
    // 1. Verify student is marked as present
    const registration = await Registration.findOne({ studentId, eventId });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.attendanceStatus !== 'present') {
      return res.status(400).json({
        message: 'Certificate can only be generated for students marked as present.',
      });
    }

    // 2. Check if certificate already exists
    let certificate = await Certificate.findOne({ studentId, eventId, certificateType });
    if (certificate) {
      // Just mark registration as generated and return
      registration.certificateGenerated = true;
      await registration.save();
      return res.json(certificate);
    }

    // 3. Generate unique certificate ID
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateId = `CERT-${eventId.toString().slice(-4)}-${studentId.toString().slice(-4)}-${randomSuffix}`;

    // 4. Create certificate
    certificate = await Certificate.create({
      studentId,
      eventId,
      certificateType,
      certificateId,
      position: certificateType === 'merit' ? position : undefined,
    });

    // 5. Mark registration as generated
    registration.certificateGenerated = true;
    await registration.save();

    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get certificates for a student
exports.getStudentCertificates = async (req, res) => {
  const { studentId } = req.params;
  try {
    const certificates = await Certificate.find({ studentId })
      .populate('studentId', 'name email rollNumber branch year')
      .populate('eventId', 'title category date venue')
      .sort({ generatedDate: -1 });

    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Stream PDF certificate download
exports.downloadCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    const cert = await Certificate.findById(id)
      .populate('studentId', 'name rollNumber branch year')
      .populate('eventId', 'title date venue');

    if (!cert) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Create PDF in landscape
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 40,
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=Certificate_${cert.eventId.title.replace(/\s+/g, '_')}.pdf`
    );

    doc.pipe(res);

    // Styling: Background color (white)
    doc.rect(0, 0, doc.page.width, doc.page.height).fillColor('white').fill();

    // Borders: Double maroon border (No hex or RGB used!)
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .strokeColor('maroon')
      .lineWidth(4)
      .stroke();

    doc.rect(26, 26, doc.page.width - 52, doc.page.height - 52)
      .strokeColor('maroon')
      .lineWidth(1)
      .stroke();

    // Decorative corners in lightgray
    doc.rect(32, 32, 20, 20).strokeColor('lightgray').stroke();
    doc.rect(doc.page.width - 52, 32, 20, 20).strokeColor('lightgray').stroke();
    doc.rect(32, doc.page.height - 52, 20, 20).strokeColor('lightgray').stroke();
    doc.rect(doc.page.width - 52, doc.page.height - 52, 20, 20).strokeColor('lightgray').stroke();

    // Content: University Header
    doc.fontSize(24)
      .fillColor('maroon')
      .text('EVENTRA UNIVERSITY', { align: 'center' });

    doc.moveDown(0.4);
    doc.fontSize(10)
      .fillColor('black')
      .text('OFFICIAL ACADEMIC CREDENTIAL', { align: 'center', characterSpacing: 1.5 });

    doc.moveDown(1.5);

    // Certificate Title
    const titleText =
      cert.certificateType === 'merit'
        ? 'CERTIFICATE OF MERIT'
        : 'CERTIFICATE OF PARTICIPATION';
    doc.fontSize(28)
      .fillColor('maroon')
      .text(titleText, { align: 'center' });

    doc.moveDown(1.5);

    // Body Text
    doc.fontSize(14)
      .fillColor('black');

    let certificateBody = '';
    if (cert.certificateType === 'merit') {
      certificateBody = `This certificate is proudly awarded to ${cert.studentId.name} for securing ${cert.position || 'Winner'} in the event "${cert.eventId.title}" organized by Eventra University.`;
    } else {
      certificateBody = `This certificate is proudly awarded to ${cert.studentId.name} for actively participating in the event "${cert.eventId.title}" organized by Eventra University.`;
    }

    doc.text(certificateBody, {
      align: 'center',
      lineGap: 6,
      width: doc.page.width - 120,
    });

    doc.moveDown(3);

    // Signature placeholders
    const currentY = doc.y;

    // Faculty Signature
    doc.moveTo(100, currentY + 30)
      .lineTo(250, currentY + 30)
      .strokeColor('lightgray')
      .stroke();
    doc.fontSize(10)
      .fillColor('black')
      .text('Faculty Coordinator', 100, currentY + 35, { width: 150, align: 'center' });

    // Date
    const eventDate = new Date(cert.eventId.date).toLocaleDateString(undefined, {
      dateStyle: 'long',
    });
    doc.fontSize(10)
      .fillColor('maroon')
      .text(`Event Date: ${eventDate}`, doc.page.width / 2 - 100, currentY + 20, {
        width: 200,
        align: 'center',
      });

    // Registrar Signature
    doc.moveTo(doc.page.width - 250, currentY + 30)
      .lineTo(doc.page.width - 100, currentY + 30)
      .strokeColor('lightgray')
      .stroke();
    doc.fontSize(10)
      .fillColor('black')
      .text('University Registrar', doc.page.width - 250, currentY + 35, {
        width: 150,
        align: 'center',
      });

    // Unique Certificate Verification ID
    doc.fontSize(8)
      .fillColor('black')
      .text(`Verification Credential: ${cert.certificateId}`, 40, doc.page.height - 30, {
        align: 'left',
      });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
