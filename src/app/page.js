import ImageUploader from '@/components/ImageUploader';

export default function Home() {
  return (
      <main className="p-6">
        <h1 className="text-2xl font-bold text-center">Passport OCR App</h1>
        <ImageUploader />
      </main>
  );
}
