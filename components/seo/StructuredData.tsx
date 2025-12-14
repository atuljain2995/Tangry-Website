interface StructuredDataProps {
  data: Record<string, any> | Record<string, any>[];
}

export const StructuredData = ({ data }: StructuredDataProps) => {
  const dataArray = Array.isArray(data) ? data : [data];

  return (
    <>
      {dataArray.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

