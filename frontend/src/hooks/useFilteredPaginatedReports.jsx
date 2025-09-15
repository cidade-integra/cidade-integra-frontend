import { useEffect, useMemo, useState } from "react";
import { useReport } from "@/hooks/useReport";

export function useFilteredPaginatedReports({
  itemsPerPage = 6,
  debounceDelay = 400,
  searchTerm,
  statusFilter,
}) {
  const { getAllReports } = useReport();
  const [allReports, setAllReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Debounce da busca
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [searchTerm, debounceDelay]);

  // Buscar todas as denúncias
  useEffect(() => {
    async function fetchReports() {
      const rawReports = await getAllReports();
      setAllReports(rawReports);
    }
    fetchReports();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    const filtered = allReports.filter((report) => {
      const matchesSearch =
        (report.title || "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (report.description || "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (report.location?.address || "").toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "todas" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredReports(filtered);
    setCurrentPage(1); // Reinicia a página ao mudar filtro
  }, [allReports, debouncedSearch, statusFilter]);

  // Paginação local
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(start, start + itemsPerPage);
  }, [filteredReports, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  return {
    paginatedReports,
    currentPage,
    totalPages,
    setCurrentPage,
    totalItems: filteredReports.length,
  };
}
