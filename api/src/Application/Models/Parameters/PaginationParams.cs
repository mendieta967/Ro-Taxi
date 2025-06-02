using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Parameters;

public class PaginationParams
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public PaginationParams()
    {
        Page = 1;
        PageSize = 10;
    }
    public PaginationParams(int page, int pageSize)
    {
        Page = page < 1 ? 1 : page;
        PageSize = pageSize > 10 ? 10 : pageSize;
    }
}
