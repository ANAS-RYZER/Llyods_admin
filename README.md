# Ryzer Admin V2

A modern admin dashboard for the Ryzer platform, built with React, TypeScript, Vite, Redux Toolkit, and Tailwind CSS.

## Features
- Modular, scalable codebase
- TypeScript for type safety
- Redux Toolkit for state management
- React Hook Form & Zod for robust form validation
- Tailwind CSS for rapid UI development
- Code splitting and lazy loading for performance
- REST API integration
- Responsive design

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
git clone <repo-url>
cd ryzer-admin-v2
npm install # or yarn install
```

### Running the App
```bash
npm run dev # or yarn dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

### Building for Production
```bash
npm run build # or yarn build
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

## Project Structure
- `src/components/` — Reusable UI components
- `src/pages/` — Application pages
- `src/store/` — Redux slices and store setup
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript type definitions
- `src/config/` — App configuration files
- `src/helpers/` — Utility/helper functions

## Updated Project Structure

### Components
- `Curd/`
- `LoadingSpinner.tsx`
- `LocationCard.tsx`
- `OrderStatusCard.tsx`
- `SearchFilter.tsx`
- `TableComponent/`
- `UseForm/`
- `cards/`
- `common/`
- `form/`
- `role/`
- `spv/`
- `stepper.tsx`
- `ui/`
- `web3/`

### Config
- `DialogConfig.tsx`
- `PieChartConfig.tsx`
- `constants.ts`
- `table/`

### Constants
- `DefaultCustomerDetails.ts`
- `formatdate.ts`
- `global.tsx`

### Helpers
- `BookingStatus.tsx`
- `CompanyStatus.tsx`
- `Contribute.tsx`
- `JoinStatus.tsx`
- `Status.tsx`
- `date_fns.ts`
- `global.tsx`
- `validates.ts`

### Hooks
- `asset/`
- `createFAQ.tsx`
- `file/`
- `meta/`
- `order/`
- `spv/`
- `transactions/`
- `use-mobile.tsx`
- `useAddAdvisor.tsx`
- `useAddBank.tsx`
- `useAddBoardMember.tsx`
- `useApi.tsx`
- `useCancel.tsx`
- `useCreateCompany.tsx`
- `useCrud.tsx`
- `useDebounce.tsx`
- `useDeleteAdvisor.tsx`
- `useDeleteCompanyMember.tsx`
- `useDistribution.tsx`
- `useEOI.tsx`
- `useEmployee.tsx`
- `useFeePercentage.tsx`
- `useFetchCompany.tsx`
- `useFetchDocuments.tsx`
- `useFetchPercentages.tsx`
- `useFetchProject.tsx`
- `useFileUpload.tsx`
- `useGetCustomer.tsx`
- `useInvestors.tsx`
- `useLocations.tsx`
- `useRoyalties.tsx`
- `useRoyaltyAccount.tsx`
- `useStatements.tsx`
- `useTemplate.tsx`
- `useUpdateCompany.tsx`
- `useUpdateFaq.tsx`
- `userCustomers.tsx`

### Layout
- `Footer.tsx`
- `Header.tsx`
- `Main/`
- `Pagination.tsx`
- `SPV/`

### Lib
- `format.utility.ts`
- `httpClient.ts`
- `utils.ts`
- `validation.ts`

### Middleware
- `Protect.tsx`

### Pages
- `.DS_Store`
- `EOI/`
- `SPV/`
- `amenities/`
- `asset/`
- `auth/`
- `blog/`
- `cancel/`
- `channelAssetsPartner/`
- `company/`
- `companyDetails/`
- `configuration/`
- `customer/`
- `customers/`
- `employee/`
- `fee/`
- `feeManagement/`
- `notification/`
- `orders/`
- `report/`
- `review/`
- `roles/`
- `setting/`
- `superAdminWithdrawal/`
- `tokenAssetPartner/`

### Providers
- `MetaMaskProvider.tsx`

### Router
- `router.tsx`

### Services
- `ApiCalls/`

### Store
- `features/`
- `hooks.ts`
- `store.ts`

### Types
- `SyncFee.ts`
- `advisor.ts`
- `basicDetails.ts`
- `comapniesList.ts`
- `company.ts`
- `controller.ts`
- `coutryTypes.ts`
- `customer.ts`
- `customerDetail.ts`
- `employeeList.ts`
- `feemanagment.ts`
- `form.ts`
- `global.ts`
- `partnet.ts`
- `project.ts`
- `role.types.ts`
- `roles.ts`
- `setting.ts`

### Utils
- `role.utils.ts`

## Environment Variables
Create a `.env` file in the root directory and add the required variables:
```
VITE_API_URL=<your-api-url>
```

## Security Notice
**Never commit sensitive information (API keys, private keys, passwords) to the repository.**

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
