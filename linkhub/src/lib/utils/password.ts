// Password strength checker based on PROMPT_ALL.txt
export function checkPasswordStrength(password: string, personalInfo: string[] = []): {
  score: 0 | 1 | 2 | 3 | 4,
  feedback: {
    suggestions: string[],
    warning: string,
    color: string,
    percentage: number,
  },
  criteria: {
    length: boolean,
    uppercase: boolean,
    lowercase: boolean,
    numbers: boolean,
    specialChars: boolean,
    commonPassword: boolean,
    personalInfo: boolean,
  }
} {
  const suggestions: string[] = [];
  let score: 0 | 1 | 2 | 3 | 4 = 0;
  let warning = '';
  let color = 'red';
  let percentage = 0;
  const common = /123456|password|qwerty|admin|linkhub|12345678|password123/;
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    specialChars: /[^A-Za-z0-9]/.test(password),
    commonPassword: !common.test(password),
    personalInfo: personalInfo.every(info => !password.toLowerCase().includes(info.toLowerCase())),
  };
  const passed = Object.values(criteria).filter(Boolean).length;
  if (!criteria.length) suggestions.push('Minimal 8 karakter');
  if (!criteria.uppercase) suggestions.push('Tambahkan huruf besar');
  if (!criteria.lowercase) suggestions.push('Tambahkan huruf kecil');
  if (!criteria.numbers) suggestions.push('Tambahkan angka');
  if (!criteria.specialChars) suggestions.push('Tambahkan karakter spesial');
  if (!criteria.commonPassword) suggestions.push('Jangan gunakan password umum');
  if (!criteria.personalInfo) suggestions.push('Jangan gunakan nama/email Anda');
  // Scoring
  if (passed <= 2) {
    score = 0; color = 'red'; warning = 'Password sangat lemah'; percentage = 20;
  } else if (passed === 3) {
    score = 1; color = 'orange'; warning = 'Password lemah'; percentage = 40;
  } else if (passed === 4) {
    score = 2; color = 'yellow'; warning = 'Password cukup'; percentage = 60;
  } else if (passed === 5 || passed === 6) {
    score = 3; color = 'blue'; warning = 'Password kuat'; percentage = 80;
  } else if (passed === 7) {
    score = 4; color = 'green'; warning = 'Password sangat kuat'; percentage = 100;
  }
  return {
    score,
    feedback: { suggestions, warning, color, percentage },
    criteria,
  };
} 