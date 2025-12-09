# Backend Architecture

```mermaid
graph TD
    Client[Client (Frontend)] -->|HTTP Requests| Server[Express Server]
    
    subgraph Middleware
        Auth[Auth Middleware]
        Error[Error Handler]
    end
    
    Server --> Auth
    Auth --> Routes
    
    subgraph "API Routes"
        AuthRoutes[/auth]
        GroupRoutes[/groups]
        PaymentRoutes[/payments]
    end
    
    Routes --> Controllers
    
    subgraph Controllers
        AuthController
        GroupController
        PaymentController
    end
    
    Controllers --> Services
    
    subgraph "Business Logic (Services)"
        AuthService
        PaymentService
    end
    
    Services --> Models
    
    subgraph "Data Layer (Mongoose)"
        UserModel
        GroupModel
        ExpenseModel
    end
    
    Models --> MongoDB[(MongoDB Database)]
    PaymentService -->|API Calls| Razorpay[Razorpay API Gateway]
```
