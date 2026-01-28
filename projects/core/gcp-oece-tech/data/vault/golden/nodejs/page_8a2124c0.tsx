import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Clock, ArrowLeft } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gray-200 mb-8">
            <Clock className="h-12 w-12 text-gray-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl">
            即将上线
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            我们正在努力开发此功能，敬请期待！
          </p>
          <div className="mt-10">
            <Button asChild>
              <Link href="/tools">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回工具列表
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}