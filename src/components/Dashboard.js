import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchLeases = async () => {
  const { data } = await axios.get("/api/leases");
  return data;
};

export default function LeaseDashboard() {
  const { data: leases, isLoading } = useQuery(["leases"], fetchLeases);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Lease Dashboard</h2>
      <ul>
        {leases.map((lease) => (
          <li key={lease.id}>
            <p>{`Lease for ${lease.monthlyRent} from ${lease.startDate} to ${lease.endDate}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
