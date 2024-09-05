import React from "react";
import ApiAlert, { ApiAlertProps } from "./api-alert";

interface ApiListProps {
	data: ApiAlertProps[];
}

const ApiList: React.FC<ApiListProps> = ({ data }) => {
	return (
		<>
			{data.map((item: ApiAlertProps, index) => (
				<ApiAlert
					key={`${item?.description} ${index}`}
					title={item?.title}
					description={item.description}
					variant={item?.variant}
				/>
			))}
		</>
	);
};

export default ApiList;
