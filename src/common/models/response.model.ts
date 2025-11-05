export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// current_page
// : 
// 1
// data
// : 
// []
// first_page_url
// : 
// "http://localhost:8880/api/platform/organizations?page=1"
// from
// : 
// null
// last_page
// : 
// 1
// last_page_url
// : 
// "http://localhost:8880/api/platform/organizations?page=1"
// links
// : 
// [{url: null, label: "&laquo; Previous", page: null, active: false},…]
// next_page_url
// : 
// null
// path
// : 
// "http://localhost:8880/api/platform/organizations"
// per_page
// : 
// 15
// prev_page_url
// : 
// null
// to
// : 
// null
// total
// : 
// 0

export interface ApiResponseWithPagination<T> {
    success: true;
    message: string;
    data: {
        data: T;
        links: Link[];
        current_page: number;
        from: number | null;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number | null;
        total: number;
    }
}

export interface Link {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}