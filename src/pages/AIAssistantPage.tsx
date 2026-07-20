import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  FiHeart,
  FiMenu,
  FiMessageSquare,
  FiPlus,
  FiSend,
  FiTrash2,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { SafeMarkdown } from '../components/shared/SafeMarkdown';
import { useAuth } from '../hooks/useAuth';
import {
  createConversation,
  deleteConversation,
  getConversation,
  getConversations,
  sendConversationMessage,
} from '../services/conversation.service';
import type { RecipeSummary } from '../types/recipe';
import { getErrorMessage } from '../utils/api-error';

const suggestedPrompts = [
  'Find a dinner under 30 minutes',
  'Suggest high-protein breakfast recipes',
  'Create a three-day vegetarian meal plan',
  'Find recipes without dairy',
  'Recommend meals based on my preferences',
];

export function AIAssistantPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sendingRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const conversationsQuery = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });
  const conversationQuery = useQuery({
    queryKey: ['conversation', selectedId],
    queryFn: () => getConversation(selectedId ?? ''),
    enabled: selectedId !== null,
  });

  useEffect(() => {
    if (selectedId === null && conversationsQuery.data?.data[0] !== undefined) {
      setSelectedId(conversationsQuery.data.data[0]._id);
    }
  }, [conversationsQuery.data, selectedId]);

  const createMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: async (conversation) => {
      await queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setSelectedId(conversation._id);
      setSidebarOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Conversation could not be created.')),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: async (_data, deletedId) => {
      if (selectedId === deletedId) setSelectedId(null);
      queryClient.removeQueries({ queryKey: ['conversation', deletedId] });
      await queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast.success('Conversation deleted');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Conversation could not be deleted.')),
  });
  const sendMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      sendConversationMessage(id, content),
  });

  const visibleMessages = useMemo(
    () => conversationQuery.data?.messages.filter((item) => item.role !== 'tool') ?? [],
    [conversationQuery.data?.messages],
  );
  const recipesById = useMemo(() => {
    const map = new Map<string, RecipeSummary>();
    conversationQuery.data?.recipes.forEach((recipe) => map.set(recipe._id, recipe));
    return map;
  }, [conversationQuery.data?.recipes]);
  const lastAssistantMessage = [...visibleMessages]
    .reverse()
    .find((item) => item.role === 'assistant');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [pendingMessage, visibleMessages.length]);

  const openConversation = (id: string) => {
    setSelectedId(id);
    setSidebarOpen(false);
    setMessage('');
  };

  const sendPrompt = async (prompt?: string) => {
    const content = (prompt ?? message).trim();
    if (!content || sendingRef.current || sendMutation.isPending) return;
    sendingRef.current = true;
    setPendingMessage(content);
    setMessage('');
    try {
      let conversationId = selectedId;
      if (conversationId === null) {
        const conversation = await createMutation.mutateAsync(content.slice(0, 80));
        conversationId = conversation._id;
        setSelectedId(conversationId);
      }
      await sendMutation.mutateAsync({ id: conversationId, content });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] }),
        queryClient.invalidateQueries({ queryKey: ['conversations'] }),
      ]);
    } catch (error) {
      setMessage(content);
      toast.error(getErrorMessage(error, 'The assistant could not respond. Please try again.'));
    } finally {
      setPendingMessage(null);
      sendingRef.current = false;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendPrompt();
    }
  };

  const confirmDelete = (id: string) => {
    if (window.confirm('Delete this conversation and its messages?')) {
      deleteMutation.mutate(id);
    }
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-stone-900 text-white">
      <div className="flex items-center justify-between border-b border-stone-700 p-4">
        <div><p className="font-bold">Conversations</p><p className="text-xs text-stone-400">Your saved meal-planning chats</p></div>
        <button className="btn btn-ghost btn-sm btn-circle text-white lg:hidden" aria-label="Close conversations" onClick={() => setSidebarOpen(false)}><FiX /></button>
      </div>
      <div className="p-3"><button className="btn btn-primary btn-sm w-full" disabled={createMutation.isPending} onClick={() => createMutation.mutate('New meal-planning chat')}>{createMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : <FiPlus />} New conversation</button></div>
      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        {conversationsQuery.isLoading && Array.from({ length: 4 }, (_, index) => <div key={index} className="mx-1 h-14 animate-pulse rounded-xl bg-stone-800" />)}
        {conversationsQuery.isError && <div className="m-2 rounded-xl bg-red-950/60 p-4 text-sm text-red-200"><p>Conversation history could not be loaded.</p><button className="mt-2 font-bold underline" onClick={() => void conversationsQuery.refetch()}>Try again</button></div>}
        {conversationsQuery.data?.data.length === 0 && <p className="px-3 py-6 text-center text-sm text-stone-400">No conversations yet. Start with one of the prompts in the chat.</p>}
        {conversationsQuery.data?.data.map((conversation) => (
          <div key={conversation._id} className={`group flex items-center rounded-xl ${selectedId === conversation._id ? 'bg-emerald-800' : 'hover:bg-stone-800'}`}>
            <button className="min-w-0 flex-1 px-3 py-3 text-left" onClick={() => openConversation(conversation._id)}><p className="truncate text-sm font-semibold">{conversation.title}</p><p className="mt-1 text-xs text-stone-400">{new Date(conversation.lastMessageAt).toLocaleDateString()}</p></button>
            <button className="btn btn-ghost btn-sm btn-circle mr-1 shrink-0 text-stone-400 opacity-100 hover:text-red-300 lg:opacity-0 lg:group-hover:opacity-100" aria-label={`Delete ${conversation.title}`} disabled={deleteMutation.isPending} onClick={() => confirmDelete(conversation._id)}><FiTrash2 /></button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="h-[calc(100vh-4rem)] min-h-[38rem] overflow-hidden bg-base-100">
      <div className="mx-auto flex h-full max-w-[100rem] border-x border-stone-200">
        <aside className="hidden w-80 shrink-0 lg:block">{sidebar}</aside>
        {sidebarOpen && <div className="fixed inset-0 z-[70] bg-stone-900/50 lg:hidden" onClick={() => setSidebarOpen(false)}><aside className="h-full w-[min(21rem,88vw)]" onClick={(event) => event.stopPropagation()}>{sidebar}</aside></div>}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-stone-200 px-4 sm:px-6">
            <button className="btn btn-ghost btn-square lg:hidden" aria-label="Open conversations" onClick={() => setSidebarOpen(true)}><FiMenu size={21} /></button>
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-white"><FiMessageSquare /></span>
            <div className="min-w-0"><h1 className="truncate font-bold">{conversationQuery.data?.conversation.title ?? 'MealMind AI Assistant'}</h1><p className="text-xs text-stone-500">Context-aware and grounded in MealMind recipes</p></div>
          </header>

          <div className="flex-1 overflow-y-auto bg-canvas px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-4xl">
              {selectedId !== null && conversationQuery.isLoading && <div className="space-y-5">{Array.from({ length: 3 }, (_, index) => <div key={index} className={`h-24 animate-pulse rounded-card bg-stone-100 ${index % 2 ? 'ml-auto w-2/3' : 'w-4/5'}`} />)}</div>}
              {selectedId !== null && conversationQuery.isError && <div className="rounded-card border border-red-200 bg-red-50 p-8 text-center"><h2 className="text-xl font-bold text-red-800">This conversation could not be loaded</h2><button className="btn mt-4 border-red-300 bg-white text-red-700" onClick={() => void conversationQuery.refetch()}>Try again</button></div>}

              {(selectedId === null || (conversationQuery.isSuccess && visibleMessages.length === 0 && pendingMessage === null)) && <WelcomePrompts onSelect={(prompt) => void sendPrompt(prompt)} disabled={sendMutation.isPending || createMutation.isPending} />}

              <div className="space-y-6">
                {visibleMessages.map((item) => <MessageBubble key={item._id} role={item.role as 'user' | 'assistant'} content={item.content} recipes={item.recipeIds.map((id) => recipesById.get(id)).filter((recipe): recipe is RecipeSummary => recipe !== undefined)} userName={user?.name ?? 'You'} userImage={user?.photoURL} />)}
                {pendingMessage !== null && <><MessageBubble role="user" content={pendingMessage} recipes={[]} userName={user?.name ?? 'You'} userImage={user?.photoURL} /><TypingIndicator /></>}
              </div>

              {!sendMutation.isPending && lastAssistantMessage !== undefined && lastAssistantMessage.suggestedQuestions.length > 0 && <div className="mt-6 pl-12"><p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">Continue the conversation</p><div className="flex flex-wrap gap-2">{lastAssistantMessage.suggestedQuestions.map((prompt) => <button key={prompt} className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-left text-sm font-semibold text-emerald-800 hover:bg-emerald-100" onClick={() => void sendPrompt(prompt)}>{prompt}</button>)}</div></div>}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="shrink-0 border-t border-stone-200 bg-base-100 p-3 sm:p-4">
            <div className="mx-auto max-w-4xl"><div className="flex items-end gap-2 rounded-2xl border border-stone-300 bg-white p-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"><textarea className="max-h-36 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 outline-none" rows={1} value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about recipes, quick meals, or a meal plan…" aria-label="Message MealMind AI" /><button className="btn btn-primary btn-square" aria-label="Send message" disabled={!message.trim() || sendMutation.isPending || createMutation.isPending} onClick={() => void sendPrompt()}>{sendMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : <FiSend />}</button></div><p className="mt-2 text-center text-xs text-stone-400">MealMind uses server tools for recipe facts. Verify ingredients for allergy safety.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WelcomePrompts({ onSelect, disabled }: { onSelect: (prompt: string) => void; disabled: boolean }) {
  return <div className="mx-auto flex min-h-[28rem] max-w-2xl flex-col items-center justify-center text-center"><span className="grid size-16 place-items-center rounded-2xl bg-emerald-100 text-primary"><FiHeart size={28} /></span><h2 className="mt-5 text-3xl font-extrabold">What should we plan?</h2><p className="mt-3 max-w-lg leading-7 text-stone-600">Ask for recipes, quick meals, dietary ideas, or a multi-day plan. MealMind will decide which server tools can help.</p><div className="mt-7 grid w-full gap-3 sm:grid-cols-2">{suggestedPrompts.map((prompt, index) => <button key={prompt} className={`rounded-xl border border-stone-200 bg-base-100 p-4 text-left text-sm font-semibold shadow-sm hover:border-emerald-300 hover:bg-emerald-50 ${index === suggestedPrompts.length - 1 ? 'sm:col-span-2' : ''}`} disabled={disabled} onClick={() => onSelect(prompt)}>{prompt}</button>)}</div></div>;
}

function MessageBubble({ role, content, recipes, userName, userImage }: { role: 'user' | 'assistant'; content: string; recipes: RecipeSummary[]; userName: string; userImage?: string | undefined }) {
  const isUser = role === 'user';
  return <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>{!isUser && <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-white"><FiHeart /></span>}<div className={`max-w-[min(44rem,85%)] ${isUser ? 'order-first' : ''}`}><div className={`rounded-2xl px-5 py-4 ${isUser ? 'rounded-br-sm bg-emerald-700 text-white' : 'rounded-bl-sm border border-stone-200 bg-base-100 text-stone-700 shadow-sm'}`}>{isUser ? <p className="whitespace-pre-wrap leading-7">{content}</p> : <SafeMarkdown content={content} />}</div>{recipes.length > 0 && <div className="mt-3 grid gap-3 sm:grid-cols-2">{recipes.map((recipe) => <Link key={recipe._id} to={`/recipes/${recipe.slug}`} className="flex overflow-hidden rounded-xl border border-stone-200 bg-base-100 shadow-sm hover:border-emerald-300"><img className="h-24 w-28 object-cover" src={recipe.image} alt="" /><div className="min-w-0 p-3"><p className="truncate font-bold text-neutral">{recipe.title}</p><p className="mt-1 text-xs text-stone-500">{recipe.category} · {recipe.preparationTime + recipe.cookingTime} min</p><p className="mt-2 text-xs font-bold text-primary">View recipe</p></div></Link>)}</div>}</div>{isUser && (userImage ? <img className="size-9 shrink-0 rounded-xl object-cover" src={userImage} alt="" referrerPolicy="no-referrer" /> : <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-stone-200 text-stone-600" aria-label={userName}><FiUser /></span>)}</div>;
}

function TypingIndicator() {
  return <div className="flex gap-3" role="status"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-white"><FiHeart /></span><div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-stone-200 bg-base-100 px-5 py-4"><span className="size-2 animate-bounce rounded-full bg-stone-400" /><span className="size-2 animate-bounce rounded-full bg-stone-400 [animation-delay:120ms]" /><span className="size-2 animate-bounce rounded-full bg-stone-400 [animation-delay:240ms]" /><span className="sr-only">MealMind is preparing a response</span></div></div>;
}
