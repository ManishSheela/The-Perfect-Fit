"use client";
import { StoreModal } from "@/components/modals/store-modal";
import { Modal } from "@/components/ui/modal";
import { useModalStore } from "@/hooks/use-store-modal";
import React, { useEffect } from "react";

const SetupPage = () => {
	const onOpen = useModalStore((state) => state.onOpen);
	const isOpen = useModalStore((state) => state.isOpen);

	useEffect(() => {
		if (!isOpen) onOpen();
	}, [isOpen, onOpen]);

	return null;
};

export default SetupPage;
