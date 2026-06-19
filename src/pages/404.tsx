import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Custom404() {
  return (
    <Layout title="Page Not Found">
      <p className="lead">
        The page you requested could not be found in the TritonAI Skills Library.
      </p>
      <p>
        <Link href="/skills" className="btn btn-primary">
          Browse Skills Library
        </Link>
      </p>
    </Layout>
  );
}
