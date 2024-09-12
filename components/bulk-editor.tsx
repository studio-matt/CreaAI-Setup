'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from 'lucide-react'
import { auth, provider } from '../firebaseConfig'; // Import Firebase auth and provider
import { signInWithPopup, signOut } from "firebase/auth"; // Import signInWithPopup and signOut

interface Product {
  id: string
  title: string
  price: number
  description: string
  brand: string
  productType: string
  tags: string
  sizes: string
  colors: string
}

const initialProducts: Product[] = [
  { id: '1', title: 'Product 1', price: 19.99, description: 'Description 1', brand: 'Brand A', productType: 'Type 1', tags: 'tag1, tag2', sizes: 'S, M, L', colors: 'Red, Blue' },
  { id: '2', title: 'Product 2', price: 29.99, description: 'Description 2', brand: 'Brand B', productType: 'Type 2', tags: 'tag2, tag3', sizes: 'M, L, XL', colors: 'Green, Yellow' },
  { id: '3', title: 'Product 3', price: 39.99, description: 'Description 3', brand: 'Brand C', productType: 'Type 1', tags: 'tag1, tag3', sizes: 'S, XL', colors: 'Black, White' },
]

export function BulkEditor() {
  const router = useRouter(); // Initialize router
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [commonEditField, setCommonEditField] = useState<keyof Product>('title')
  const [commonEditValue, setCommonEditValue] = useState<string>('')
  const [isMakeDialogOpen, setIsMakeDialogOpen] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleChange = (id: string, field: keyof Product, value: string | number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ))
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProducts(new Set(products.map(p => p.id)))
    } else {
      setSelectedProducts(new Set())
    }
  }

  const handleSelect = (id: string) => {
    setSelectedProducts(prevSelected => {
      const newSelected = new Set(prevSelected)
      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }
      return newSelected
    })
  }

  const handleSave = () => {
    console.log('Saving products:', products)
    toast({
      title: "Changes saved",
      description: `Updated ${selectedProducts.size} products`,
    })
  }

  const handleCommonEdit = () => {
    setProducts(products.map(product => 
      selectedProducts.has(product.id) 
        ? { ...product, [commonEditField]: commonEditField === 'price' ? parseFloat(commonEditValue) : commonEditValue }
        : product
    ))
    toast({
      title: "Common edit applied",
      description: `Updated ${commonEditField} for ${selectedProducts.size} products`,
    })
  }

  const handleMakeScenarioSelect = () => {
    if (selectedScenario) {
      toast({
        title: "Make.com Scenario Selected",
        description: `Connected to scenario: ${selectedScenario}`,
      })
      setIsMakeDialogOpen(false)
    } else {
      toast({
        title: "Error",
        description: "Please select a scenario",
        variant: "destructive",
      })
    }
  }

  const handleExportToXLS = () => {
    console.log('Exporting products to XLS:', products)
    toast({
      title: "Export Initiated",
      description: "Your XLS file is being generated and will download shortly.",
    })
  }

  const handleInstall = () => {
    toast({
      title: "Installation Started",
      description: "The Shopify Bulk Editor is being installed.",
    })
  }

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      setIsLoggedIn(true); // Set logged in state
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      setIsLoggedIn(false); // Update logged in state
      router.push('/'); // Redirect to the login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Image
            src="/images/headshop-logo-tiki-head.png"
            alt="Company Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold">Shopify Bulk Editor</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleLogout} className="flex items-center justify-center">
            <span>Logout</span>
          </Button>
          <Button onClick={handleLogin} className="w-full flex items-center justify-center">
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            <span>Sign in with Google</span>
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Input 
                type="checkbox" 
                checked={selectedProducts.size === products.length}
                onChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Product Type</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Sizes</TableHead>
            <TableHead>Colors</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Input 
                  type="checkbox" 
                  checked={selectedProducts.has(product.id)}
                  onChange={() => handleSelect(product.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={product.title} 
                    onChange={(e) => handleChange(product.id, 'title', e.target.value)}
                  />
                  <Dialog open={isMakeDialogOpen} onOpenChange={setIsMakeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-8.414V7h2v5.586l3.707 3.707-1.414 1.414L12 14.414l-3.293 3.293-1.414-1.414L11 12.586z"/>
                        </svg>
                        <span className="sr-only">Connect to Make.com</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Select Make.com Scenario</DialogTitle>
                      </DialogHeader>
                      <RadioGroup onValueChange={setSelectedScenario} className="gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="scenario1" id="scenario1" />
                          <Label htmlFor="scenario1">Update Product Information</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="scenario2" id="scenario2" />
                          <Label htmlFor="scenario2">Sync with Inventory System</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="scenario3" id="scenario3" />
                          <Label htmlFor="scenario3">Generate Product Report</Label>
                        </div>
                      </RadioGroup>
                      <Button onClick={handleMakeScenarioSelect}>Connect</Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
              <TableCell>
                <Input 
                  type="number"
                  value={product.price} 
                  onChange={(e) => handleChange(product.id, 'price', parseFloat(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <Textarea 
                  value={product.description} 
                  onChange={(e) => handleChange(product.id, 'description', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={product.brand} 
                  onChange={(e) => handleChange(product.id, 'brand', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={product.productType} 
                  onChange={(e) => handleChange(product.id, 'productType', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={product.tags} 
                  onChange={(e) => handleChange(product.id, 'tags', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={product.sizes} 
                  onChange={(e) => handleChange(product.id, 'sizes', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={product.colors} 
                  onChange={(e) => handleChange(product.id, 'colors', e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 space-y-2">
        {selectedProducts.size >= 2 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Make Common Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Multiple Products</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="field" className="text-right">
                    Field
                  </Label>
                  <Select onValueChange={(value) => setCommonEditField(value as keyof Product)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select field to edit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="description">Description</SelectItem>
                      <SelectItem value="brand">Brand</SelectItem>
                      <SelectItem value="productType">Product Type</SelectItem>
                      <SelectItem value="tags">Tags</SelectItem>
                      <SelectItem value="sizes">Sizes</SelectItem>
                      <SelectItem value="colors">Colors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Value
                  </Label>
                  <Input
                    id="value"
                    className="col-span-3"
                    value={commonEditValue}
                    onChange={(e) => setCommonEditValue(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleCommonEdit}>Apply Common Edit</Button>
            </DialogContent>
          </Dialog>
        )}
        <div className="flex space-x-2">
          <Button onClick={handleSave} disabled={selectedProducts.size === 0}>
            Save Changes ({selectedProducts.size} products)
          </Button>
          <Button onClick={handleExportToXLS} variant="outline">
            Export to XLS
          </Button>
        </div>
      </div>
    </div>
  )
}