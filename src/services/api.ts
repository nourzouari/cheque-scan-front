// src/services/api.ts
// Version simplifiée pour développement sans backend

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data pour tester l'interface
export const mockProcessCheque = async () => {
  // Simuler un délai de traitement
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Retourner des données factices
  return {
    chequeNumber: '123456789',
    amount: '1500.500',
    amountWords: 'Mille cinq cents dinars et cinq cents millimes',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    drawerName: 'Mohamed Ali',
    beneficiaryName: 'Société Tunisienne',
    bankName: 'BIAT',
    rib: '12345678901234567890',
    iban: 'TN59 1234 5678 9012 3456 7890',
    confidence: {
      chequeNumber: 95,
      amount: 98,
      amountWords: 85,
      issueDate: 92,
      dueDate: 88,
      drawerName: 75,
      beneficiaryName: 70,
      bankName: 96,
      rib: 45,
      iban: 40
    }
  };
};

// Service avec mock pour tester
export const chequeService = {
  processCheque: mockProcessCheque,
  
  saveCheque: async (data: any) => {
    console.log('Données sauvegardées:', data);
    return { success: true, message: 'Chèque sauvegardé avec succès' };
  },
  
  getCheques: async () => {
    return {
      data: [
        { id: 1, chequeNumber: '123456', amount: '1500', status: 'validated' },
        { id: 2, chequeNumber: '789012', amount: '3200', status: 'pending' },
      ]
    };
  }
};

export default api;