export default function (document: string): boolean {
    const numbersOnly = document.replace(/\D/g, '');
    
    if (numbersOnly.length === 11) {
        return validateCPF(numbersOnly);
    } else if (numbersOnly.length === 14) {
        return validateCNPJ(numbersOnly);
    }
    
    return false;
}
  
function validateCPF(cpf: string): boolean {
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let remainder = sum % 11;
    const verificationDigit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cpf.charAt(9)) !== verificationDigit1) {
        return false;
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    remainder = sum % 11;
    const verificationDigit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(cpf.charAt(10)) === verificationDigit2;
}
  
function validateCNPJ(cnpj: string): boolean {
    if (/^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }
    
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let position = size - 7;
    
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * position--;
        if (position < 2) {
          position = 9;
        }
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) {
        return false;
    }
    
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    position = size - 7;
    
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * position--;
        if (position < 2) {
          position = 9;
        }
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    
    return result === parseInt(digits.charAt(1));
}