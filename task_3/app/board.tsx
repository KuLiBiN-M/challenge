import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store/store";
import {
  moveDocument,
  addDocument,
  setDocuments,
  removeDocument, // добавим действие для удаления
} from "./store/documentsSlice";
import { useState, useEffect } from "react";

interface Column {
  id: "in-progress" | "under-review" | "completed";
  title: string;
}

export default function Board() {
  const dispatch: AppDispatch = useDispatch();
  const documents = useSelector((state: RootState) => state.documents);
  const [newDocumentTitle, setNewDocumentTitle] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const columns: Column[] = [
    { id: "in-progress", title: "В работе" },
    { id: "under-review", title: "На проверке" },
    { id: "completed", title: "Завершено" },
  ];

  // Загружаем данные из localStorage при монтировании
  useEffect(() => {
    const storedDocuments = localStorage.getItem("documents");
    if (storedDocuments) {
      dispatch(setDocuments(JSON.parse(storedDocuments)));
    } else {
      // Установить начальное состояние, если ничего не найдено
      dispatch(
        setDocuments([
          { id: "1", title: "Документ 1", status: "in-progress" },
          { id: "2", title: "Документ 2", status: "in-progress" },
          { id: "3", title: "Документ 3", status: "under-review" },
        ])
      );
    }
  }, [dispatch]);

  // Сохраняем документы в localStorage при каждом их изменении
  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(documents));
  }, [documents]);

  const handleAddDocument = () => {
    if (newDocumentTitle.trim()) {
      const newDoc = {
        id: `${Date.now()}`,
        title: newDocumentTitle.trim(),
        status: "in-progress" as const,
      };
      dispatch(addDocument(newDoc));
      setNewDocumentTitle("");
    }
  };

  const handleDragStart = (e: React.DragEvent, documentId: string) => {
    e.currentTarget.classList.add("dragging");
    e.dataTransfer.setData("documentId", documentId);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("dragging");
  };

  const handleDrop = (
    e: React.DragEvent,
    columnId: "in-progress" | "under-review" | "completed"
  ) => {
    const documentId = e.dataTransfer.getData("documentId");
    dispatch(moveDocument({ id: documentId, newStatus: columnId }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Функция для удаления документа
  const handleRemoveDocument = (id: string) => {
    dispatch(removeDocument(id));
  };

  return (
    <div className="board">
      <div className="add-document">
        <input
          type="text"
          value={newDocumentTitle}
          onChange={(e) => setNewDocumentTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddDocument();
          }}
          placeholder="Добавить новый документ"
          aria-label="Название нового документа"
        />
        <button onClick={handleAddDocument} disabled={!newDocumentTitle.trim()}>
          Добавить
        </button>
      </div>

      <div className="filter-documents">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Фильтровать документы"
          aria-label="Фильтр по заголовку"
        />
      </div>

      <div className="columns">
        {columns.map((column) => (
          <div
            key={column.id}
            className="column"
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
          >
            <h2>{column.title}</h2>
            <div className="droppable-area">
              {documents
                .filter(
                  (doc) =>
                    doc.status === column.id &&
                    doc.title.toLowerCase().startsWith(filter.toLowerCase())
                )
                .map((doc) => (
                  <div
                    key={doc.id}
                    className={`document ${doc.status}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, doc.id)}
                    onDragEnd={handleDragEnd}
                    role="listitem"
                    aria-label={`Перетащите документ "${doc.title}"`}
                  >
                    {doc.title}
                    {column.id === "completed" && (
                      <button
                        className="remove-button"
                        onClick={() => handleRemoveDocument(doc.id)}
                        aria-label={`Удалить документ "${doc.title}"`}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
