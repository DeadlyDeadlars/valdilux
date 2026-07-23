import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Индивидуальные проекты мебели из массива — ValDiLux',
  description: 'Разработка и изготовление мебели по индивидуальным размерам из массива дуба, бука, ясеня. От эскиза до готового изделия. Екатеринбург.',
  openGraph: {
    title: 'Индивидуальные проекты мебели из массива — ValDiLux',
    description: 'Создаём уникальные предметы мебели под ваше пространство. От эскиза до готового изделия.',
  },
};

export default function IndividualProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
