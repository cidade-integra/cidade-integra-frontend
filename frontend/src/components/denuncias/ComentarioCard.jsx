import { useState, useRef, useEffect, useCallback, memo } from "react";
import { MessageSquare, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReportComments } from "@/hooks/useReportComments";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// palavras bloqueadas
const BLOCKED_WORDS = [
  "merda", "bosta", "porra", "caralho", "puta", "putaria", "babaca", "fdp",
  "filho da puta", "desgraçado", "arrombado", "vagabundo",
  "vai se fuder", "vai tomar no cu",
];

const containsBlockedWords = (text) => {
  const lower = text.toLowerCase();
  return BLOCKED_WORDS.some((word) => lower.includes(word));
};

// componente memorizado de um comentário
const CommentItem = memo(function CommentItem({
  comment,
  user,
  deletingId,
  setDeletingId,
  deleteComment,
  setSelectedCommentId,
  selectedCommentId,
}) {
  const isAdmin = comment.role === "admin";
  const isDeleting = deletingId === comment.id;

  return (
    <div
      className={`${
        isAdmin
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
          : "bg-background border border-border"
      } rounded-lg p-4 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center shadow-sm ${
            isAdmin
              ? "bg-gradient-to-br from-green-600 to-emerald-600"
              : "bg-gradient-to-br from-blue-500 to-blue-600"
          }`}
        >
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`font-semibold ${
                  isAdmin ? "text-green-800" : "text-foreground"
                }`}
              >
                {comment.author}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  isAdmin
                    ? "bg-green-200 text-green-800"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {isAdmin ? "Administrador" : "Cidadão"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {comment.createdAt?.toDate
                ? new Date(comment.createdAt.toDate()).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "agora"}
            </span>
          </div>
          <p
            className={`text-sm leading-relaxed ${
              isAdmin ? "text-green-800" : "text-foreground"
            }`}
          >
            {comment.message}
          </p>

          {/* botão de exclusão */}
          {(comment.isOwner || user?.role === "admin") && (
            <div className="flex items-center gap-2 mt-2 justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-destructive/10"
                    disabled={isDeleting}
                    onClick={() => setSelectedCommentId(comment.id)}
                    title="Excluir comentário"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir este comentário?
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-white hover:bg-red-700"
                      onClick={async () => {
                        setDeletingId(comment.id);
                        try {
                          await deleteComment(comment.id);
                        } catch {}
                        setDeletingId(null);
                        setSelectedCommentId(null);
                      }}
                      disabled={isDeleting || deletingId === selectedCommentId}
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default function ComentarioCard({ reportId, scrollToCommentInput }) {
  const PAGE_SIZE = 5;
  const {
    comments,
    loading,
    error,
    addComment,
    loadMore,
    hasMore,
    deleteComment,
  } = useReportComments(reportId, PAGE_SIZE);

  const { user } = useCurrentUser();
  const textareaRef = useRef(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const MAX_LENGTH = 500;
  const MIN_LENGTH = 5;


  // debounced e memoized handlers
  const handleChange = useCallback((e) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setNewComment(e.target.value);
      setErrorMsg("");
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = newComment.trim();

    if (!trimmed) return setErrorMsg("O comentário não pode estar em branco.");
    if (trimmed.length < MIN_LENGTH)
      return setErrorMsg(`O comentário deve ter pelo menos ${MIN_LENGTH} caracteres.`);
    if (containsBlockedWords(trimmed))
      return setErrorMsg("Seu comentário contém palavras não permitidas.");

    // UI otimista
    const tempId = Date.now().toString();
    const optimisticComment = {
      id: tempId,
      author: user?.name || "Você",
      message: trimmed,
      role: user?.role || "user",
      createdAt: new Date(),
      isOwner: true,
    };

    addComment(optimisticComment, true); // adiciona otimisticamente
    setNewComment("");
    setErrorMsg("");

    try {
      setSubmitting(true);
      await addComment(trimmed); // salva no backend
    } catch {
      setErrorMsg("Erro ao publicar comentário.");
    } finally {
      setSubmitting(false);
    }
  }, [newComment, addComment, user]);

  // scroll para o input de comentário
  useEffect(() => {
    if (scrollToCommentInput) {
      scrollToCommentInput.current = () => {
        textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        textareaRef.current?.focus();
      };
    }
  }, [scrollToCommentInput]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-verde" />
          Comentários
        </h2>
        <span className="text-muted-foreground text-sm bg-muted px-2 py-1 rounded-full">
          {comments.length} comentário{comments.length !== 1 && "s"}
        </span>
      </div>

      {/* campo de comentário */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border/50">
        <div className="flex items-start gap-3">
          <div className="bg-verde h-10 w-10 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              placeholder="Adicione seu comentário sobre esta denúncia..."
              className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 text-gray-600"
              value={newComment}
              onChange={handleChange}
              style={{ resize: "vertical" }}
              maxLength={MAX_LENGTH}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-muted-foreground">
                {`Seja respeitoso e construtivo (${newComment.length}/${MAX_LENGTH})`}
              </span>
              <Button
                size="sm"
                className="bg-verde hover:bg-verde/90"
                onClick={handleSubmit}
                disabled={submitting || !newComment.trim() || newComment.trim().length < MIN_LENGTH}
              >
                {submitting ? "Publicando..." : "Publicar"}
              </Button>
            </div>
            {errorMsg && <div className="text-xs text-red-500 mt-2">{errorMsg}</div>}
          </div>
        </div>
      </div>

      {/* lista de comentários */}
      <div className="space-y-4">
        {loading && <p className="text-sm text-muted-foreground">Carregando...</p>}
        {error && <p className="text-sm text-red-500">Erro ao carregar comentários.</p>}

        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            user={user}
            deleteComment={deleteComment}
            deletingId={deletingId}
            setDeletingId={setDeletingId}
            selectedCommentId={selectedCommentId}
            setSelectedCommentId={setSelectedCommentId}
          />
        ))}

        {hasMore && !loading && (
          <div className="flex justify-center mt-4">
            <Button
              size="sm"
              className="bg-verde hover:bg-verde/90"
              onClick={loadMore}
            >
              Carregar mais comentários
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}