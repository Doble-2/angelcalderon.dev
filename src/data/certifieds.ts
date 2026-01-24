export type Certified = {
  name: string;
  slug: string;
  platform: string;
  date: string; // dd/mm/yyyy
  order: number;
  code?: string | null;
};

export const certifieds: Certified[] = [
  {
    name: "Flutter",
    slug: "flutter",
    platform: "Platzi",
    date: "02/11/2022",
    order: 9,
    code: "a9abfa81-eec6-4eb4-a655-6f590f91d43b",
  },
  {
    name: "Desarrollo móvil",
    slug: "desarrollo-movil",
    platform: "Google",
    date: "20/04/2023",
    order: 7,
    code: "U2G ZEU 2KW",
  },
  {
    name: "Yummy Codicon",
    slug: "yummy-codicon",
    platform: "Yummy",
    date: "27/08/2023",
    order: 8,
    code: null,
  },
  {
    name: "Participación CODICON",
    slug: "participacion-codicon",
    platform: "Lexpin",
    date: "18/03/2023",
    order: 6,
    code: null,
  },
  {
    name: "Segundo lugar Codicon 2024",
    slug: "segundo-lugar-codicon-2024",
    platform: "Lexpin",
    date: "21/03/2024",
    order: 10,
    code: null,
  },
  {
    name: "Frontend Developer",
    slug: "frontend-developer",
    platform: "Platzi",
    date: "23/12/2022",
    order: 6,
    code: "c4fb33d6-94b1-4908-9a49-c634c66ef28d",
  },
  {
    name: "Programación Básica",
    slug: "programacion-basica",
    platform: "Platzi",
    date: "14/10/2022",
    order: 2,
    code: "b3ba8ff4-1916-41d7-bd3b-26f87972d62d",
  },
  {
    name: "Basic english:A1",
    slug: "basic-english-a1",
    platform: "Platzi",
    date: "11/12/2022",
    order: 2,
    code: "19be1d9c-1fb6-4057-bd83-5e4407027103",
  },
];

export function getCertifieds(): Certified[] {
  return [...certifieds].sort((a, b) => Number(b.order) - Number(a.order));
}
