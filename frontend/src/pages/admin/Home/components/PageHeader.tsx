import React from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-primary-600">{title}</h1>
      {description ? <p className="mt-2 text-gray-600">{description}</p> : null}
    </div>
  );
};

export default PageHeader;
