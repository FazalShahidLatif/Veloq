const aiRefine = require('./aiRefine');
const { chargeUser } = require('./paymentService');
const { createZip, uploadToStorage } = require('./storageService');
const { updateTemplateDB } = require('./database');

exports.handler = async (event) => {
  try {
    const { userId, userRole, templateSource, platform, templateDetails } = event;
    
    // Determine price based on role and source
    let price;
    if (userRole === 'Creator') {
      price = templateSource === 'Public' ? 5 : 0;
    } else if (userRole === 'Guest') {
      price = templateSource === 'Public' ? 14 : 19;
    }
    
    // Charge user
    const paymentResult = await chargeUser(userId, price, 'Creation');
    if (!paymentResult.success) {
      return { statusCode: 402, body: JSON.stringify({ error: 'Payment failed' }) };
    }
    
    // AI Refinement
    const refinedTemplate = await aiRefine.refine(templateDetails);
    
    // Generate ZIP
    const zipBuffer = await createZip(refinedTemplate);
    
    // Upload to storage
    const storagePath = `templates/${refinedTemplate.template_id}/version_1.zip`;
    await uploadToStorage(storagePath, zipBuffer);
    
    // Update database
    const dbResult = await updateTemplateDB({
      template_id: refinedTemplate.template_id,
      platform,
      source: templateSource,
      title: refinedTemplate.title,
      description: refinedTemplate.description,
      purpose: refinedTemplate.purpose,
      tags: refinedTemplate.tags,
      creator_id: userRole === 'Creator' ? userId : null,
      price_first: price,
      modification_price: userRole === 'Creator' ? 4 : 5,
      immutable: templateSource === 'In-House',
      version_number: 1
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        template_id: refinedTemplate.template_id,
        download_link: `/download?template_id=${refinedTemplate.template_id}&version=1`
      })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
