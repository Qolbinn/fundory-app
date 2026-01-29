import { DonutChartCategory } from '@/Components/DonutChartCategory';
import { LineChartTransaction } from '@/Components/LineChartTransaction';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon } from 'lucide-react';

// interface DashboardProps {
//     user: User;
// }

export default function OperationalDashboard() {
    // { user }: DashboardProps
    return (
        <DashboardLayout
            // user={user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Operational
                </h2>
            }
        >
            <Head title="Dashboard" />

            {/* <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div> */}

            {/* <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" /> */}
            <section className="grid gap-4 md:grid-cols-12">
                <Card className="md:col-span-4">
                    <CardHeader>
                        <CardTitle>Sisa Saldo</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>

                <div className="grid grid-cols-3 gap-4 md:col-span-8">
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Total Pengeluaran</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-end border-t border-border p-0">
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 px-4 py-2 text-sm"
                            >
                                View more <ArrowRightIcon />
                            </Link>
                        </CardFooter>
                    </Card>

                    <Card className="">
                        <CardHeader>
                            <CardTitle>Jumlah Transaksi</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-end border-t border-border p-0">
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 px-4 py-2 text-sm"
                            >
                                View more <ArrowRightIcon />
                            </Link>
                        </CardFooter>
                    </Card>

                    <Card className="">
                        <CardHeader>
                            <CardTitle>Jumlah Kategori</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-end border-t border-border p-0">
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 px-4 py-2 text-sm"
                            >
                                View more <ArrowRightIcon />
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-12">
                {/* Pie Chart Pengeluaran */}
                <div className="md:col-span-4">
                    <DonutChartCategory />
                </div>

                {/* Line Chart Grafik Pengeluaran */}
                <div className="md:col-span-8">
                    <LineChartTransaction />
                </div>
            </section>

            {/* <section className="grid gap-4 md:grid-cols-12">

            </section> */}

            {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
        </DashboardLayout>
    );
}
