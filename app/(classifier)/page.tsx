'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DollarSign, Home, Menu, Package2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

export default function Dashboard() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('openai')
  const [temperature, setTemperature] = useState(0.5)
  const [prompt, setPrompt] = useState('')
  const [open, setOpen] = useState(false)

  console.log('result', result)

  const handleProcessCsv = async () => {
    setResult(null)
    setLoading(true)

    try {
      const response = await fetch(
        `/api/process-csv?model=${selectedModel}${temperature ? `&temperature=${temperature}` : ''}${prompt ? `&prompt=${prompt}` : ''}`
      )
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error fetching API:', error)
      setResult({ error: 'Failed to process CSV' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">AI Classifier</span>
            </Link>
            {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button> */}
          </div>
          <div className="flex flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Classifier
              </Link>
              {/* <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Orders
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Products{' '}
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Customers
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Analytics
              </Link> */}
            </nav>
          </div>
          {/* <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
      <div className="flex w-full flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 md:hidden lg:h-[60px] lg:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">AI Classifier</span>
                </Link>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Classifier
                </Link>
                {/* <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link> */}
              </nav>
              {/* <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div> */}
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form> */}
          </div>
          {/* <DropdownMenu> */}
          {/* <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger> */}
          {/* <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </header>
        <main className="container flex w-full flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Classifier</h1>
          </div>
          <div className="flex max-w-screen-2xl rounded-lg">
            <div className="relative flex w-full flex-col items-start gap-0">
              <form className="grid w-full grid-cols-3 items-start gap-6">
                <fieldset className="col-span-3 grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Settings
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="role">Model</Label>
                    <Select
                      defaultValue="openai"
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">
                          OpenAI gpt-4o-mini
                        </SelectItem>
                        <SelectItem value="anthropic">
                          {' '}
                          Anthropic claude 3.5 sonnet
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      value={temperature}
                      placeholder="0.4"
                      min={0}
                      max={1}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="content">Prompt</Label>
                    <Textarea
                      id="content"
                      placeholder="Default prompt is in the api route"
                      value={prompt}
                      className="min-h-[9.5rem]"
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                  <button
                    disabled={loading}
                    onClick={handleProcessCsv}
                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {/* Loading spinner */}
                    {loading && (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-5 w-5 animate-spin text-white"
                      >
                        <path
                          d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    )}

                    <span>{loading ? 'Processing...' : 'Process CSV'}</span>

                    {result?.error ? (
                      <div className="mt-4">
                        <p className="text-red-500">{result.error}</p>
                      </div>
                    ) : null}
                  </button>
                </fieldset>
              </form>
              <div className="mt-8 w-full">
                <div className="flex flex-1 flex-col gap-4 md:gap-8">
                  <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Emergencies</CardTitle>
                        <CardDescription>
                          Requests that are emergencies
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="grid auto-rows-min gap-2">
                          <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none text-green-800">
                            {result ? (
                              result.truePositive
                            ) : (
                              <Skeleton className="h-[26px] w-[40px]" />
                            )}
                            <span className="text-sm font-normal text-muted-foreground">
                              True Positive
                            </span>
                          </div>
                        </div>
                        <div className="grid auto-rows-min gap-2">
                          <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none text-rose-500">
                            {result ? (
                              result.falsePositive
                            ) : (
                              <Skeleton className="h-[26px] w-[40px]" />
                            )}
                            <span className="text-sm font-normal text-muted-foreground">
                              False Positive
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Non-Emergencies</CardTitle>
                        <CardDescription>
                          Requests that are not emergencies
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="grid auto-rows-min gap-2">
                          <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none text-green-800">
                            {result ? (
                              result.trueNegative
                            ) : (
                              <Skeleton className="h-[26px] w-[40px]" />
                            )}
                            <span className="text-sm font-normal text-muted-foreground">
                              True Negative
                            </span>
                          </div>
                        </div>
                        <div className="grid auto-rows-min gap-2">
                          <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none text-rose-500">
                            {result ? (
                              result.falseNegative
                            ) : (
                              <Skeleton className="h-[26px] w-[40px]" />
                            )}
                            <span className="text-sm font-normal text-muted-foreground">
                              False Negative
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Totals</CardTitle>
                        <CardDescription></CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="grid auto-rows-min gap-2">
                          <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                            {result ? (
                              result.emergencyCount
                            ) : (
                              <Skeleton className="h-[26px] w-[40px]" />
                            )}
                            <span className="text-sm font-normal text-muted-foreground">
                              Total Emergencies
                            </span>
                          </div>
                        </div>
                        <div className="grid auto-rows-min gap-2">
                          <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                            {result ? (
                              result.nonEmergencyCount
                            ) : (
                              <Skeleton className="h-[26px] w-[40px]" />
                            )}
                            <span className="text-sm font-normal text-muted-foreground">
                              Total Non-Emergencies
                            </span>
                          </div>
                        </div>
                        <div className="grid auto-rows-min gap-2">
                          <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                            {result ? (
                              `${result.accuracy}%`
                            ) : (
                              <Skeleton className="h-[26px] w-[40px]" />
                            )}

                            <span className="text-sm font-normal text-muted-foreground">
                              Accuracy
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {loading ? (
                  <div className="mt-8 grid gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-4 h-4 w-2/3" />
                    <Skeleton className="mt-4 h-4 w-1/2" />
                    <Skeleton className="mt-4 h-4 w-3/4" />
                  </div>
                ) : result ? (
                  <Card className="mt-8">
                    {result.falsePositiveText.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">
                              False Positive (model thinks they should be
                              classified as Non-emergencies)
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result?.falsePositiveText.map((text: string) => (
                            <TableRow key={text}>
                              <TableCell>{text}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}

                    {result.falseNegativeText.length > 0 && (
                      <Table className="mt-8">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">
                              False Negative (model thinks they should be
                              classified as emergencies)
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result?.falseNegativeText.map((text: string) => (
                            <TableRow key={text}>
                              <TableCell>{text}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </Card>
                ) : null}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
