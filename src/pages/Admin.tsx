import { useState } from "react";
import { Package, Users, ShoppingCart, TrendingUp, Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/Header";
import freshMilk from "@/assets/fresh-milk.jpg";
import freshCurd from "@/assets/fresh-curd.jpg";
import artisanCheese from "@/assets/artisan-cheese.jpg";

const Admin = () => {
  // const [products] = useState([
  //   {
  //     id: 1,
  //     name: "Fresh Whole Milk",
  //     category: "Milk",
  //     price: 3.99,
  //     stock: 150,
  //     status: "Active",
  //     image: freshMilk
  //   },
  //   {
  //     id: 2,
  //     name: "Creamy Curd",
  //     category: "Curd",
  //     price: 2.49,
  //     stock: 75,
  //     status: "Active",
  //     image: freshCurd
  //   },
  //   {
  //     id: 3,
  //     name: "Artisan Cheese Selection",
  //     category: "Cheese",
  //     price: 12.99,
  //     stock: 25,
  //     status: "Low Stock",
  //     image: artisanCheese
  //   }
  // ]);

  // const [orders] = useState([
  //   {
  //     id: "ORD-001",
  //     customer: "John Doe",
  //     date: "2024-01-15",
  //     status: "Processing",
  //     total: 45.97,
  //     items: 3
  //   },
  //   {
  //     id: "ORD-002",
  //     customer: "Jane Smith",
  //     date: "2024-01-14",
  //     status: "Shipped",
  //     total: 23.48,
  //     items: 2
  //   },
  //   {
  //     id: "ORD-003",
  //     customer: "Mike Johnson",
  //     date: "2024-01-13",
  //     status: "Delivered",
  //     total: 67.95,
  //     items: 5
  //   }
  // ]);

  // const [customers] = useState([
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     email: "john@example.com",
  //     orders: 12,
  //     totalSpent: 456.78,
  //     lastOrder: "2024-01-15"
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     email: "jane@example.com",
  //     orders: 8,
  //     totalSpent: 234.56,
  //     lastOrder: "2024-01-14"
  //   },
  //   {
  //     id: 3,
  //     name: "Mike Johnson",
  //     email: "mike@example.com",
  //     orders: 15,
  //     totalSpent: 678.90,
  //     lastOrder: "2024-01-13"
  //   }
  // ]);

  // const stats = [
  //   {
  //     title: "Total Products",
  //     value: "156",
  //     change: "+12%",
  //     icon: Package,
  //     color: "text-blue-600"
  //   },
  //   {
  //     title: "Total Orders",
  //     value: "1,234",
  //     change: "+23%",
  //     icon: ShoppingCart,
  //     color: "text-green-600"
  //   },
  //   {
  //     title: "Total Customers",
  //     value: "856",
  //     change: "+8%",
  //     icon: Users,
  //     color: "text-purple-600"
  //   },
  //   {
  //     title: "Revenue",
  //     value: "₹12,345",
  //     change: "+18%",
  //     icon: TrendingUp,
  //     color: "text-orange-600"
  //   }
  // ];

  // return (
    // <div className="min-h-screen bg-background">
      // <Header />
      
      // <div className="container mx-auto px-4 py-8">
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your dairy e-commerce store</p>
        </div> */}

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change} from last month</p>
                    </div>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div> */}

        {/* <Tabs defaultValue="products" className="w-full"> */}
          {/* <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">All</TabsTrigger>
            <TabsTrigger value="orders">Approved</TabsTrigger>
            <TabsTrigger value="customers">Pending</TabsTrigger>
            <TabsTrigger value="analytics">Cancelled</TabsTrigger>
          </TabsList> */}

          {/* <TabsContent value="products" className="mt-6"> */}
            {/* <Card> */}
              {/* <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Management</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader> */}
              {/* <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search products..." className="pl-10" />
                  </div>
                  <Button variant="outline">Filter</Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Badge variant={product.status === "Active" ? "default" : "secondary"}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent> */}
            {/* </Card> */}
          {/* </TabsContent> */}

          {/* <TabsContent value="orders" className="mt-6"> */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search orders..." className="pl-10" />
                  </div>
                  <Button variant="outline">Filter</Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={order.status === "Delivered" ? "default" : 
                                   order.status === "Processing" ? "secondary" : "outline"}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Update</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card> */}
          {/* </TabsContent> */}

          {/* <TabsContent value="customers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search customers..." className="pl-10" />
                  </div>
                  <Button variant="outline">Filter</Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.orders}</TableCell>
                        <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>{new Date(customer.lastOrder).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Contact</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Sales chart would go here
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Popular Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {150 - index * 20} sold
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent> */}
        {/* </Tabs> */}
      {/* </div> */}
    {/* </div> */}
  {/* ); */}
}

export default Admin;