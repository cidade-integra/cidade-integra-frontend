import { useState, useRef, useEffect } from "react";
import { MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReportComments } from "@/hooks/useReportComments";

export default function ComentarioCard({ reportId, scrollToCommentInput }) {
  const { comments, loading, error, addComment } = useReportComments(reportId);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      setSubmitting(true);
      await addComment(newComment);
      setNewComment("");
    } catch (err) {
      console.error("Erro ao publicar comentário:", err);
    } finally {
      setSubmitting(false);
    }
  };

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

      {/* formulário de comentário */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border/50">
        <div className="flex items-start gap-3">
          <div className="bg-verde h-10 w-10 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <textarea
              placeholder="Adicione seu comentário sobre esta denúncia..."
              className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background text-sm ring-offset-verde placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ resize: "vertical" }}
              ref={textareaRef}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-muted-foreground">
                Seja respeitoso e construtivo em seus comentários
              </span>
              <Button
                size="sm"
                className="bg-verde hover:bg-verde/90"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Publicando..." : "Publicar Comentário"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* lista de comentários */}
      <div className="space-y-4">
        {loading && <p className="text-sm text-muted-foreground">Carregando...</p>}
        {error && (
          <p className="text-sm text-red-500">Erro ao carregar comentários.</p>
        )}
        {comments.map((comment) => {
          const isAdmin = comment.role === "admin";

          return (
            <div
              key={comment.id}
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
                        {isAdmin ? "Oficial" : "Cidadão"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {comment.createdAt?.toDate
                        ? new Date(
                            comment.createdAt.toDate()
                          ).toLocaleDateString("pt-BR", {
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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}