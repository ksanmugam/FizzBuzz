# FizzBuzz Game - Setup and Running Instructions

This project contains a web-based FizzBuzz game with a .NET 8 backend API and React 18 frontend, complete with admin functionality and comprehensive testing.

## Project Structure

```
fizzbuzz/
├── FizzBuzz.Server/            # .NET 8 Web API
│   ├── Controllers/            # API Controllers
│   ├── Data/                   # Database context and configurations
│   ├── Entities/               # Data models/entities
│   ├── Models/                 # DTOs and view models
│   ├── Repositories/           # Data access layer
│   └── Services/               # Business logic layer
├── FizzBuzz.Server.Tests/      # Backend unit and integration tests
│   ├── Controllers/            # Controller tests
│   ├── Services/               # Service layer tests
└── fizzbuzz.client/            # React 18 TypeScript app
    ├── src/                    # Source code
    └── various config files    # Vite, TypeScript, etc.
```

## Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- **Visual Studio (strongly recommended)** or Visual Studio Code

## Running the Application

### ⭐ **Recommended: Visual Studio (Best Experience)**

This is the **easiest and most reliable** way to run the FizzBuzz game:

1. **Open Solution**: Open the solution file in Visual Studio
2. **Click Start**: Simply click the "Start" button in Visual Studio (or press F5)
3. **Automatic Launch**: Visual Studio will:
   - Build and start the ASP.NET 8 backend server at `http://localhost:5000`
   - Automatically launch the React TypeScript frontend in your default browser
   - Enable hot reload for both backend and frontend development
   - Handle all the integration seamlessly

**That's it!** The entire application will be running with just one click.

---

## Alternative Setup Methods

### Manual Backend Setup
```bash
cd FizzBuzz.Server
dotnet restore
dotnet run
```

The API will be available at `http://localhost:5000`.

### Manual Frontend Setup
```bash
cd fizzbuzz.client
npm install
npm run dev
```

The React app will be available at `http://localhost:50720`

> **Note**: The manual approach requires managing both backend and frontend separately, which is more complex and error-prone. **Visual Studio is strongly recommended** for the best development experience.

## Frontend Configuration

The frontend is **fully integrated** with the ASP.NET 8 backend and runs automatically when you start the application in Visual Studio.

### UI Libraries (Pre-configured)
The project uses both:
- **Chakra UI** v2.10.9 for main component styling and theming
- **Tailwind CSS** v3.1.8 for utility-first styling where needed

All dependencies are already installed and configured.

## Testing

### Backend Testing (.NET)

#### Visual Studio Test Explorer (Recommended)
1. **Open Test Explorer**: Go to `Test` → `Test Explorer` (or press `Ctrl+E, T`)
2. **Build Solution**: Press `Ctrl+Shift+B` to build the solution
3. **Run Tests**: 
   - Click "Run All Tests" in Test Explorer
   - Or use `Test` → `Run All Tests` (Ctrl+R, A)
   - Right-click specific tests to run individually

#### Command Line Testing
```bash
# Run all backend tests
dotnet test

# Run tests in the specific test project
dotnet test FizzBuzz.Server.Tests

# Run with detailed output
dotnet test --verbosity normal
```

#### Test Project Structure
The `FizzBuzz.Server.Tests` project includes:
- **Unit Tests**: Testing individual components in isolation
- **Integration Tests**: Testing API endpoints end-to-end
- **Service Tests**: Testing business logic layer
- **Repository Tests**: Testing data access layer

#### Test Technologies Used
- **xUnit** - Primary testing framework
- **Moq** - Mocking framework for dependencies
- **Microsoft.AspNetCore.Mvc.Testing** - Integration testing for ASP.NET Core
- **Microsoft.EntityFrameworkCore.InMemory** - In-memory database for testing

### Frontend Testing (React)

#### Visual Studio Integration
- Use Visual Studio's integrated terminal to run frontend tests
- Open terminal: `View` → `Terminal`
- Navigate to frontend: `cd fizzbuzz.client`

#### Command Line Testing
```bash
# Frontend tests  
cd fizzbuzz.client
npm test
```

## Usage Instructions

### Playing the Game

1. **Start**: Click "Play Game" in the header navigation
2. **Begin**: Click "Start Game" to initialize a new game session
3. **Rules**: View the current game rules displayed at the top
4. **Play**: 
   - A random number (1-100) will be displayed
   - Enter your answer based on the FizzBuzz rules
   - Submit your answer to see if it's correct
   - Continue with the next number
5. **Score**: Track your progress with the live score display
6. **End**: Click "End Game" when you want to stop
7. **Summary**: View detailed game statistics and question history

### Admin Panel

1. **Access**: Click "Admin Panel" in the header navigation
2. **View Rules**: See all existing rules with their status
3. **Add Rule**: Click "Add New Rule" to create a new game rule
4. **Edit Rule**: Click "Edit" on any existing rule to modify it
5. **Toggle Status**: Activate/deactivate rules without deleting them
6. **Delete Rule**: Remove rules (with protection against deleting the last active rule)

### Default Game Rules

- Numbers divisible by 3 → "Fizz"
- Numbers divisible by 5 → "Buzz"
- Numbers divisible by both 3 and 5 → "FizzBuzz"

## API Endpoints

### Game Endpoints
- `POST /api/game/start` - Start a new game session
- `POST /api/game/answer` - Submit an answer
- `POST /api/game/end/{sessionId}` - End game and get summary
- `GET /api/game/summary/{sessionId}` - Get game summary

### Rules Endpoints
- `GET /api/rules` - Get all rules
- `GET /api/rules/active` - Get active rules only
- `GET /api/rules/{id}` - Get specific rule
- `POST /api/rules` - Create new rule
- `PUT /api/rules/{id}` - Update existing rule
- `DELETE /api/rules/{id}` - Delete rule

## Features

### Game Features
- ✅ Random number generation (server-side)
- ✅ Real-time answer validation
- ✅ Live score tracking
- ✅ Detailed game summary with question history
- ✅ Configurable rules support
- ✅ Responsive design

### Admin Features
- ✅ Full CRUD operations for game rules
- ✅ Rule activation/deactivation
- ✅ Duplicate divisor prevention
- ✅ Minimum active rule enforcement
- ✅ Real-time rule validation
- ✅ User-friendly error handling

### Technical Features
- ✅ Clean Architecture with separation of concerns
- ✅ In-memory database with Entity Framework
- ✅ Comprehensive error handling
- ✅ Input validation and sanitization
- ✅ CORS configuration for frontend integration
- ✅ TypeScript for type safety
- ✅ Custom React hooks for state management
- ✅ Chakra UI components with theme consistency
- ✅ Tailwind CSS utilities for custom styling
- ✅ Vite for fast development and building
- ✅ TanStack React Query for server state management
- ✅ **Comprehensive test suite with high code coverage**
- ✅ **Separate test project following .NET best practices**

## Development Workflow

### Running Tests During Development

#### Continuous Testing in Visual Studio
1. **Live Unit Testing** (Premium feature): `Test` → `Live Unit Testing` → `Start`
2. **Test-Driven Development**: Write tests first, then implement features
3. **Code Coverage**: View coverage directly in Visual Studio

#### Test-First Development Approach
```bash
# 1. Write a failing test
# 2. Run tests to confirm failure
dotnet test FizzBuzz.Server.Tests

# 3. Implement minimal code to pass
# 4. Run tests again to confirm pass
dotnet test FizzBuzz.Server.Tests

# 5. Refactor and repeat
```

## Troubleshooting

### Common Issues

#### If Visual Studio Doesn't Start Properly
1. **Check Startup Project**: Ensure the correct project is set as the startup project
2. **Rebuild Solution**: Right-click solution → Rebuild Solution
3. **Clear Cache**: Tools → Options → Projects and Solutions → Clear cache
4. **Node.js Dependencies**: Ensure Node.js is installed and npm dependencies are restored

#### Test-Related Issues
1. **Tests Not Appearing**: Build the solution first (`Ctrl+Shift+B`)
2. **Test Explorer Empty**: Close and reopen Test Explorer, or restart Visual Studio
3. **Tests Failing**: Check that all NuGet packages are restored (`dotnet restore`)
4. **Integration Tests Failing**: Ensure no other instances of the application are running

#### Manual Troubleshooting
1. **Backend Issues**: Check that .NET 8 SDK is installed and ports aren't blocked
2. **Frontend Issues**: Verify Node.js 18+ is installed and run `npm install` in fizzbuzz.client
3. **Integration Issues**: Restart Visual Studio if frontend doesn't launch automatically

### Performance Optimization
- Backend uses Entity Framework with proper indexing
- Frontend implements proper React optimization patterns
- TanStack React Query provides caching and background updates
- Chakra UI components are optimized for performance
- Tailwind CSS is configured for production builds with purging
- Vite provides fast HMR and optimized production builds
- API responses are kept minimal and focused

## Development Notes

### Architecture Decisions
- **Backend**: Clean Architecture with Controllers → Services → Repositories
- **Frontend**: Component-based with custom hooks for business logic
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Hybrid approach with Chakra UI components and Tailwind CSS utilities
- **Build Tool**: Vite for fast development and optimized builds
- **Testing**: Jest + React Testing Library for frontend, xUnit + Moq for backend
- **Test Organization**: Separate test project (`FizzBuzz.Server.Tests`) following .NET conventions

### Testing Best Practices Implemented
- **Arrange-Act-Assert** pattern for clear test structure
- **Mocking dependencies** to test components in isolation
- **Integration tests** for API endpoints using TestHost
- **In-memory database** for repository testing
- **Descriptive test names** that explain the scenario being tested
- **Test categories** for different types of tests (Unit, Integration)

### Security Considerations
- Input validation on both client and server
- CORS properly configured
- No authentication required per specifications
- SQL injection prevention through Entity Framework
- XSS prevention through proper input sanitization

## Quick Start Summary

### 🚀 **Best Way: Visual Studio (Recommended)**
1. **Open**: Load the solution in Visual Studio
2. **Click Start**: Press the "Start" button or F5
3. **Run Tests**: Open Test Explorer (`Ctrl+E, T`) and click "Run All Tests"
4. **Done!**: Backend, React app, and tests are all ready

### Alternative: Command Line (More Complex)
1. **Backend**: `cd FizzBuzz.Server && dotnet run`
2. **Frontend**: `cd fizzbuzz.client && npm install && npm run dev`
3. **Tests**: `dotnet test` from solution root
4. **Access**: Manually navigate to frontend and backend URLs

**💡 Tip**: Visual Studio provides the smoothest development experience with one-click startup, integrated debugging, comprehensive test runner, and hot reload for both backend and frontend!

The application will be ready to use with default FizzBuzz rules, full admin functionality, and a comprehensive test suite to ensure code quality and reliability.