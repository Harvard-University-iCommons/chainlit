import { Helmet } from 'react-helmet';

export default function Head({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
    </div>
  );
}
