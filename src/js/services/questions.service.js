export async function getQuestions() {
  const response = await fetch("/public/data/questions.json");

  if (!response.ok) {
    throw new Error("No se pudieron cargar las preguntas.");
  }

  return response.json();
}