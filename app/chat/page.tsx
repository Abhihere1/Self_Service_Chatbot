import ChatBot from "@/components/ChatBot";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ChatPage({ searchParams }: Props) {
  const params = await searchParams;
  const rawCategory = params.category;
  const category = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;
  return <ChatBot initialCategory={category} />;
}
