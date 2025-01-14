function ShareLeaseForm({ leaseId }) {
  const [email, setEmail] = useState("");

  const handleShare = async () => {
    try {
      await axios.post("/api/shareLease", { leaseId, sharedWithEmail: email });
      alert("Lease shared successfully!");
    } catch {
      alert("Failed to share lease.");
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Enter email to share lease"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleShare}>Share Lease</button>
    </div>
  );
}
