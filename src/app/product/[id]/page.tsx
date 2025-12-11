import ProductDetailComp from '@/app/components/product'
import { requireAuthSSR } from '@/lib/authSSRWrapper';

async function ProductDetail() {
  await requireAuthSSR();
  return <ProductDetailComp />;
}
export default ProductDetail