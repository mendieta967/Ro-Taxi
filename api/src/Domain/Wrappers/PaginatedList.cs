using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models;

public class PaginatedList<T>
{
    public int TotalData { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public List<T> Data { get; set; }

    public PaginatedList(List<T> data, int totalData, int pageNumber, int pageSize, int totalPages)
    {
        Data = data;
        TotalData = totalData;
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalPages = totalPages;
    }
}
