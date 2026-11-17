
import {
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  Clock,
  Truck,
  CheckCircle,
} from "lucide-react";

const statistics = [
  {
    title: "Ventas del día",
    value: "$897.400",
    description: "Ingresos registrados",
    icon: DollarSign,
    color: "bg-[#a94f63]",
  },
  {
    title: "Pedidos totales",
    value: "125",
    description: "Pedidos registrados",
    icon: ShoppingBag,
    color: "bg-[#8a5a6b]",
  },
  {
    title: "Clientes",
    value: "86",
    description: "Clientes registrados",
    icon: Users,
    color: "bg-[#c6a27c]",
  },
  {
    title: "Productos",
    value: "48",
    description: "Productos disponibles",
    icon: Package,
    color: "bg-[#5b2333]",
  },
];

const orders = [
  {
    id: "#MH-001",
    customer: "María González",
    amount: "$125.000",
    status: "Pendiente",
  },
  {
    id: "#MH-002",
    customer: "Laura Martínez",
    amount: "$89.900",
    status: "En proceso",
  },
  {
    id: "#MH-003",
    customer: "Sofía Ramírez",
    amount: "$156.000",
    status: "Entregado",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">

      {/* ENCABEZADO */}
      <section>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#a94f63]">
          Resumen general
        </p>

        <h1 className="font-heading text-4xl text-[#3e1a26]">
          Dashboard Overview
        </h1>

        <p className="mt-2 text-sm text-[#8a5a6b]">
          Bienvenido al panel administrativo de MarketHub.
        </p>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className="border border-[#ebd3ce] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-[#8a5a6b]">
                    {stat.title}
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold text-[#3e1a26]">
                    {stat.value}
                  </h2>
                </div>

                <div className={`${stat.color} p-3 text-white`}>
                  <Icon size={23} />
                </div>

              </div>

              <p className="mt-4 text-xs text-[#8a5a6b]">
                {stat.description}
              </p>
            </article>
          );
        })}

      </section>

      {/* ESTADOS DE PEDIDOS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {[
          {
            title: "Pendientes",
            value: "18",
            icon: Clock,
            color: "text-[#c6a27c]",
          },
          {
            title: "En proceso",
            value: "12",
            icon: Truck,
            color: "text-[#a94f63]",
          },
          {
            title: "Entregados",
            value: "95",
            icon: CheckCircle,
            color: "text-[#6d9275]",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="flex items-center gap-4 border border-[#ebd3ce] bg-white p-5"
            >
              <Icon size={28} className={item.color} />

              <div>
                <p className="text-sm text-[#8a5a6b]">
                  {item.title}
                </p>

                <p className="text-xl font-semibold text-[#3e1a26]">
                  {item.value}
                </p>
              </div>
            </article>
          );
        })}

      </section>

      {/* PEDIDOS RECIENTES */}
      <section className="border border-[#ebd3ce] bg-white p-6">

        <h2 className="font-heading text-2xl text-[#3e1a26]">
          Pedidos recientes
        </h2>

        <div className="mt-6 overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead>
              <tr className="border-b border-[#ebd3ce] text-[#8a5a6b]">
                <th className="py-4">Pedido</th>
                <th className="py-4">Cliente</th>
                <th className="py-4">Total</th>
                <th className="py-4">Estado</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#ebd3ce]/60 text-[#3e1a26]"
                >
                  <td className="py-4 font-medium">
                    {order.id}
                  </td>

                  <td className="py-4">
                    {order.customer}
                  </td>

                  <td className="py-4">
                    {order.amount}
                  </td>

                  <td className="py-4">
                    <span className="bg-[#f8d0cb]/50 px-3 py-1 text-xs">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </section>

    </div>
  );
}
