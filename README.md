# Health Trend Keeper

A modern web application that helps users track their health metrics by intelligently extracting data from medical reports and visualizing trends over time.

![Health Trend Keeper](https://placeholder-image.com/health-trend-keeper.png)

## Features

- **Intelligent Report Processing**: Upload your medical reports (PDF, JPG, PNG) and let AI extract key health metrics automatically
- **Health Metrics Tracking**: Monitor blood pressure, cholesterol, glucose levels, and weight over time
- **Interactive Visualizations**: View your health trends with interactive charts featuring threshold indicators for normal/abnormal values
- **Profile Management**: Maintain your personal health profile and track weight measurements manually
- **AI-Powered Chat**: Ask questions about your health data and get insights through a conversational interface
- **Secure Authentication**: Your health data remains private with comprehensive user authentication
- **Responsive Design**: Access your health information on any device with a fully responsive interface

## Technologies

- **Frontend**: React, TypeScript, Vite, TailwindCSS, ShadcnUI
- **Database & Auth**: Supabase (PostgreSQL, Authentication, Storage)
- **ORM**: DrizzleORM for type-safe database operations
- **AI Integration**: OpenAI GPT-4o for report processing and chat functionality
- **PDF Processing**: pdf-parse for text extraction

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Supabase account for the backend services

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd health-trend-keeper

# Install dependencies
npm install

# Create a .env file with your Supabase credentials
echo "VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key" > .env

# Start the development server
npm run dev
```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up the following tables in your Supabase database:
   - `users` - For user profiles
   - `reports` - For uploaded medical reports
   - `measurements` - For health metrics extracted from reports
3. Create a storage bucket named `reports` for file uploads
4. Set up Row-Level Security policies for your tables
5. Run database migrations:
   ```
   npm run db:migrate
   ```

## Usage

1. **Register & Login**: Create an account and complete your profile setup
2. **Upload Reports**: Upload your medical reports through the Reports page
3. **View Metrics**: Review extracted health metrics from your reports
4. **Track Trends**: Analyze your health data using the Charts page
5. **Chat with AI**: Ask questions about your health data through the chat interface

## Development

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations

## License

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7d4587f7-b4e5-410c-aa91-5aa2170b0bd5) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
