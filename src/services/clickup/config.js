/**
 * @file config.js
 * @description Centralized configuration for ClickUp integration.
 */

module.exports = {
  API_KEY: process.env.CLICKUP_API_KEY || (() => {
    throw new Error(
      'CLICKUP_API_KEY not set. Add it to .env or set as environment variable.'
    );
  })(),
  WORKSPACE_ID: '90132645314',

  SPACES: {
    CLIENTS: '901312834269',
    MANAGEMENT: '901311391143',
  },

  FOLDERS: {
    TRAFFIC: '901316473884',
    SOCIAL: '901316465410',
    ONBOARDING: '901316473918',
    DIRECTORIA: '901317383741',
  },

  CANVA: {
    SP_HAUS_REPORT: 'DAG8RK_mm0Q',
  },

  LISTS: {
    MASTER_APPROVAL: '901325879909',
    BOARD_REPORTS: '901325819456',
  },

  CLIENT_MAPPING: [
    { name: 'Backstage Grow', traffic: '901324771662', social: '901324771638', dir: 'BKSGrow' },
    { name: 'Espaço Constru', traffic: '901324526551', social: '901324526474', dir: 'EspacoNetworkConstru' },
    { name: 'Via BR Cenografia', traffic: '901324526552', social: '901324514634', dir: 'ViaBrCenografia' },
    { name: 'GT House', traffic: '901324526554', social: '901324517019', dir: 'GTHouse' },
    { name: 'sp HAUS', traffic: '901324526553', social: '901324514510', dir: 'spHaus', canvaId: 'DAG8RK_mm0Q' },
  ],
};
