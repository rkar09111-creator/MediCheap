import Medicine from '../models/Medicine.js';

export const askPharmacist = async (req, res) => {
  try {
    const { medicineId, question } = req.body;
    
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Mock AI Response Logic
    // In a real app, this would call OpenAI/Gemini
    let response = "";
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('what is') || lowerQuestion.includes('explain')) {
      response = `${medicine.name} (${medicine.genericName}) is used for ${medicine.indications?.join(', ') || 'various therapeutic purposes'}. It works by ${medicine.description?.slice(0, 100)}...`;
    } else if (lowerQuestion.includes('side effect')) {
      response = `Common side effects of ${medicine.name} include ${medicine.sideEffects?.join(', ') || 'nausea, dizziness, and headache'}. Please consult a doctor if symptoms persist.`;
    } else if (lowerQuestion.includes('dose') || lowerQuestion.includes('how to take')) {
      response = `The recommended dosage for ${medicine.name} is ${medicine.dosage || 'as directed by your physician'}. Always take it with water and do not skip doses.`;
    } else {
      response = `As your AI Pharmacist, I can tell you that ${medicine.name} is a highly effective ${medicine.category}. It contains ${medicine.genericName}. Regarding your specific question: "${question}", I recommend following the prescribed protocol or asking our human pharmacists for clinical-grade advice.`;
    }

    res.status(200).json({
      success: true,
      data: {
        answer: response,
        disclaimer: 'This information is AI-generated and should not replace professional medical advice.'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'AI Pharmacist is busy', error: error.message });
  }
};
