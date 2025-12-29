import { requireAuthSSR } from "@/lib/authSSRWrapper"
import MyOrdersComp from "../components/orders/myOrders"

async function Orders(){
  await requireAuthSSR();
  return <MyOrdersComp />
}
export default Orders