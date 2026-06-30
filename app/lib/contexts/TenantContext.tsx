

// src/lib/contexts/TenantContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

type TenantContextType = {
     companyId: string | null
     company: Company | null
     isLoading: boolean
     refresh: () => Promise<void>
}

// Minimal Company type to satisfy TypeScript. Extend as needed.
type Company = {
     id: string
     [key: string]: any
}

const TenantContext = createContext<TenantContextType>({
     companyId: null,
     company: null,
     isLoading: true,
     refresh: async () => { }
})

export function TenantProvider({ children }: { children: React.ReactNode }) {
     const { data: session } = useSession()
     const [company, setCompany] = useState<Company | null>(null)
     const [isLoading, setIsLoading] = useState(true)

     // Guard against session.user not having companyId in the NextAuth types
     useEffect(() => {
          const companyId = (session as any)?.user?.companyId as string | undefined
          if (companyId) {
               fetchCompany(companyId)
          } else {
               setIsLoading(false)
          }
     }, [session])

     const fetchCompany = async (companyId: string) => {
          try {
               const response = await fetch(`/api/companies/${companyId}`)
               const data = await response.json()
               setCompany(data)
          } catch (error) {
               console.error('Failed to fetch company:', error)
          } finally {
               setIsLoading(false)
          }
     }

     return (
          <TenantContext.Provider value={{
               companyId: (session as any)?.user?.companyId || null,
               company,
               isLoading,
               refresh: () => {
                    const cid = (session as any)?.user?.companyId as string | undefined
                    if (cid) return fetchCompany(cid)
                    return Promise.resolve()
               }
          }}>
               {children}
          </TenantContext.Provider>
     )
}

export const useTenant = () => useContext(TenantContext)