import { verifySession } from "@/src/auth/dal";
import { ProductService } from '@/src/services/product-service';
import { CashService } from '@/src/services/cash-service';

// Logic Components
import { CashStateSync } from './CashStateSync';
import { CheckoutInitializer } from "./CheckoutInitializer";
import { CashModalController } from "./CashModalController";

// UI Components
import TerminalContainer from "./TerminalContainer";
import { SaleSuccessModal } from "@/src/components/pos/SaleSuccessModal";

export default async function TerminalTresPage() {
    const session = await verifySession();
    const [products, cashStatus] = await Promise.all([
        ProductService.getPosProducts(""),
        CashService.getStatus()
    ]);

    return (
        <div className="h-full w-full bg-background">
            {/* 1. Sync Cash State for Header/UI */}
            <CashStateSync 
                isOpen={cashStatus.isOpen} 
                shiftId={cashStatus.shift?._id} 
            />

            {/* 2. Initialize Checkout Session (Hydrate Store) */}
            {cashStatus.shift?._id && (
                <CheckoutInitializer 
                    userId={session.user._id || ""} 
                    shiftId={cashStatus.shift._id} 
                />
            )}

            {/* 3. Main POS Interface */}
            <TerminalContainer 
                initialProducts={products} 
                isCashOpen={cashStatus.isOpen} 
                userId={session.user._id || ""}
            />

            {/* 4. Overlays & Controllers */}
            {session.user._id && (
                <CashModalController 
                    userId={session.user._id} 
                    isCashOpen={cashStatus.isOpen} 
                />
            )}

            {/* 5. Post-Sale Feedback (Global) */}
            <SaleSuccessModal />
        </div>
    );
}