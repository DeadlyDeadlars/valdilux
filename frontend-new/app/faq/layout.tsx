import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — частые вопросы о мебели из массива | ValDiLux',
  description: 'Ответы на частые вопросы: сроки изготовления, доставка по России, оплата, гарантия на мебель из массива дерева.',
  openGraph: {
    title: 'FAQ — частые вопросы о мебели из массива | ValDiLux',
    description: 'Сроки изготовления, доставка, оплата, гарантия на премиальную мебель из массива.',
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Где находится производство мебели?",
      "acceptedAnswer": { "@type": "Answer", "text": "Наше производство находится в Екатеринбурге." }
    },
    {
      "@type": "Question",
      "name": "Можно ли приехать на фабрику?",
      "acceptedAnswer": { "@type": "Answer", "text": "Да, можем провести экскурсию по цеху, показать используемые материалы и наши работы. Фото и видео процесса отправляем клиентам по запросу." }
    },
    {
      "@type": "Question",
      "name": "Сколько времени занимает изготовление?",
      "acceptedAnswer": { "@type": "Answer", "text": "Все зависит от сложности заказа и дополнительных пожеланий, обычно стандартные позиции производим до 45 календарных дней." }
    },
    {
      "@type": "Question",
      "name": "Как доставляете заказ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Доставляем заказ транспортными компаниями по России и в страны СНГ. Стоимость доставки — по индивидуальному расчёту." }
    },
    {
      "@type": "Question",
      "name": "На каких условиях оформляется заказ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Заключаем договор, оплату принимаем по счету: 70% предоплата, 30% — по готовности изделия. Работаем с физическими и юридическими лицами. Доступен ЭДО." }
    }
  ]
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
