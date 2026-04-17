export function validateRegisterForm(data) {
  const errors = {};

  if (!data.nombre) {
    errors.nombre = "El nombre completo es obligatorio.";
  }

  if (!data.apoderado) {
    errors.apoderado = "El nombre del apoderado es obligatorio.";
  }

  if (!data.correo) {
    errors.correo = "El correo electrónico es obligatorio.";
  } else if (!isValidEmail(data.correo)) {
    errors.correo = "El correo electrónico no es válido.";
  }

  if (!data.whatsappApoderado) {
    errors.whatsappApoderado = "El WhatsApp del apoderado es obligatorio.";
  } else if (!isValidPhone(data.whatsappApoderado)) {
    errors.whatsappApoderado = "El número del apoderado no es válido.";
  }

  if (!data.whatsapp) {
    errors.whatsapp = "El WhatsApp es obligatorio.";
  } else if (!isValidPhone(data.whatsapp)) {
    errors.whatsapp = "El número de WhatsApp no es válido.";
  }

  if (!data.colegio) {
    errors.colegio = "El nombre del colegio es obligatorio.";
  }

  if (!data.carreraInteres) {
    errors.carreraInteres = "La carrera de interés es obligatoria.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9]{7,15}$/.test(phone);
}