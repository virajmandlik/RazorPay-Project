# Frontend Architecture

```mermaid
graph LR
    User -->|Interacts| Browser
    Browser -->|Loads| App[App (Vite)]
    
    subgraph "Global State"
        AuthContext
    end
    
    App --> AuthContext
    App --> Router[React Router]
    
    subgraph Pages
        Dashboard
        Login
        Register
    end
    
    Router --> Pages
    
    subgraph Components
        AddExpenseModal
        AddMemberModal
        CreateGroupModal
    end
    
    Dashboard --> Components
    
    subgraph "API Layer"
        Axios[Axios Instance]
        AuthService(api.auth)
        GroupService(api.groups)
        PaymentService(api.payment)
    end
    
    Pages --> AuthService
    Dashboard --> GroupService
    Dashboard --> PaymentService
    Components --> GroupService
    
    Axios -->|HTTP Requests| Backend[Backend API]
    PaymentService -->|Triggers| Rzp[Razorpay Checkout Script]
```
