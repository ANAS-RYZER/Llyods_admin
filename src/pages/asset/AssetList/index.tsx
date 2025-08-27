import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TableComponent from "@/components/TableComponent";
import Pagination from "@/layout/Pagination";
import queryString from "query-string";
import { useAssetApi } from "@/hooks/asset/useAssetApi";
import AddAssetDialog from "./AddAssetDialog";
import UpdateAssetStatusDialog from "./UpdateAssetStatusDialog";
import getColumns from "./columns";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useMetaMask } from "@/providers/MetaMaskProvider";

const Index: React.FC = () => {
  const [asset, setAsset] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const searchTerm = useDebounce(search, 500);
  const {
    assetList,
    pagination,
    getAssetList,
    updateAssetStatus,
    statusUpdate,
    setStatusUpdate,
  } = useAssetApi();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const page = Number(queryParams.page) || 1;
  const limit = Number(queryParams.limit) || 10;
  const columns = getColumns(setAsset);

  const [isToggleSwitchClicked, setIsToggleSwitchClicked] = useState(false);
  const { connect, isConnected, account } = useMetaMask();

  const onPageChange = (page: number) => {
    navigate(`?page=${page}&limit=${limit}`);
  };

  const onPageSizeChange = (pageSize: number) => {
    navigate(`?page=${page}&limit=${pageSize}`);
  };

  useEffect(() => {
    getAssetList({ page, limit, search: searchTerm });
  }, [page, limit, searchTerm]);

  const updateStatus = async () => {
    if (asset) {
      if (!isConnected) {
        console.log("Not connected wallet address (if block):", account);
        try {
          const metamaskData:
            | { metamaskAccount: string; chainId: number }
            | undefined = await connect();

          if (metamaskData?.metamaskAccount) {
            await updateAssetStatus(
              asset._id,
              asset.status === "active" ? "inactive" : "active",
              metamaskData.metamaskAccount
            );
          }
        } catch (error) {
          console.error("Failed to connect wallet:", error);
          return;
        }
      } else {
        console.log("Connected wallet address (else block):", account);
        if (account) {
          await updateAssetStatus(
            asset._id,
            asset.status === "active" ? "inactive" : "active",
            account
          );
        }
      }
      setAsset(null);
      setStatusUpdate("idle");
    }
  };

  return (
    <div className="p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Assets List </h1>
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search assets..."
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[200px] h-10"
          />
          <Button type="button" onClick={() => setOpen(true)}>
            + Add Asset
          </Button>
        </div>
      </div>

      <AddAssetDialog open={open} setOpen={setOpen} />

      <UpdateAssetStatusDialog
        asset={asset}
        setAsset={setAsset}
        updateStatus={updateStatus}
        status={statusUpdate}
        setStatusUpdate={setStatusUpdate}
      />

      <div className="space-y-4">
        <TableComponent columns={columns} data={assetList} model="asset" />
        <Pagination
          {...pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
};

export default Index;
