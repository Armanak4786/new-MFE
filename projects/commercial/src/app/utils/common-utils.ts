import html2canvas from 'html2canvas';
import { DocumentViewComponent } from '../assetlink/components/document-view/document-view.component';
import { FileDetail } from './common-interface';
import * as XLSX from 'xlsx';
import { FacilityType, wholesale_Floating_Floor_Requests } from './common-enum';

export const formatDate = (date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
  // Subtract one year from the current date
};

export const transformSlashDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return dateStr;

  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;

  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};

export const getOneMonthPrior = (date): Date => {
  const oneYearPrior = new Date(date);

  // Set the year to one year prior
  oneYearPrior.setFullYear(oneYearPrior.getFullYear() - 1);

  // Handle edge case: if Feb 29 to Feb 28 or March 1 (leap year case)
  if (
    date.getMonth() === 1 && // February (0-based index)
    date.getDate() === 29 && // Feb 29
    oneYearPrior.getDate() < 29
  ) {
    oneYearPrior.setDate(28); // Ensure consistent behavior
  }

  return oneYearPrior;
};

export const calculateForecastRangeForYear = (
  inputDate: Date | string = new Date()
) => {
  let today = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;

  // If the parsed date is invalid, fall back to current date
  if (isNaN(today.getTime())) {
    today = new Date();
  }

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  let forecastEnd = new Date(
    today.getFullYear() + 1,
    today.getMonth(),
    today.getDate()
  );

  // Handle edge cases (e.g., Feb 29 → adjust to Feb 28 or last day of month)
  if (forecastEnd.getDate() !== today.getDate()) {
    forecastEnd = new Date(today.getFullYear() + 1, today.getMonth() + 1, 0);
  }

  return {
    today: formatDate(today),
    firstDayOfMonth: formatDate(firstDayOfMonth),
    forecastEnd: formatDate(forecastEnd),
  };
};

export const calculateForecastForOneMonth = (today = new Date()) => {
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Last day of the current month
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    firstDayOfMonth: formatDate(firstDayOfMonth),
    lastDayOfMonth: formatDate(lastDayOfMonth),
  };
};

export const convertDate = (dateStr) => {
  const dateObj = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
  };
  return dateObj.toLocaleDateString('en-US', options);
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1] || '';
        resolve(base64String);
      } else {
        reject(new Error('Failed to read file as base64 string.'));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export const isValidDateFormat = (date: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date);
};

export const formatToDayMonth = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const monthShort = date.toLocaleString('en-US', { month: 'short' });
  return `${day} ${monthShort}`;
};

export const formatToQuarter = (list) => {
  list.forEach((item) => {
    const date = new Date(item.month);
    const yearShort = date.getFullYear().toString().slice(-2);
    const month = date.getMonth(); // 0-based index

    const quarters = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
    const quarterIndex = Math.floor(month / 3);

    item.transformDate = `${quarters[quarterIndex]} ${yearShort}`;
  });

  return list;
};

export const print = () => {
  const scale = 2; // Increase scale for better print quality
  html2canvas(document.body, { scale })
    .then((canvas) => {
      // Get the generated image from the canvas
      const img = canvas.toDataURL('image/png');

      // Create an iframe for printing
      const printFrame = document.createElement('iframe');
      printFrame.style.display = 'none';
      document.body.appendChild(printFrame);

      // Get the iframe document for writing content
      const printDocument = printFrame.contentWindow.document;
      printDocument.open();
      printDocument.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          @media print {
            img {
              width: 100%;
              height: auto;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <img src="${img}" style="width: 100%; height: auto;"/>
      </body>
    </html>
  `);
      printDocument.close();

      // Trigger the print action
      printFrame.onload = function () {
        printFrame.contentWindow.print();
        document.body.removeChild(printFrame); // Clean up the iframe
      };
    })
    .catch((error) => {
      console.error('Error generating print preview:', error);
    });
};

export const convertToBinary = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const convertDateFormat = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const downloadDoc = (blob, fileName) => {
  if (blob) {
    //const url = window.URL.createObjectURL(blob); // Create a URL for the blob
    const a = document.createElement('a'); // Create an anchor element
    a.href = blob; // Set the href to the blob URL
    a.download = fileName; // Set the file name for download
    document.body.appendChild(a); // Append the anchor to the body
    a.click(); // Trigger the download
    window.URL.revokeObjectURL(blob); // Clean up the URL object
    a.remove(); // Remove the anchor from the DOM
  } else {
    console.error('No file data available for download.');
  }
};

export const calculatePaymentNotYetAllocated = (payments) => {
  let totalAmountReceived = 0;
  let totalAllocatedAmount = 0;

  if (Array.isArray(payments)) {
    payments.forEach((payment) => {
      totalAmountReceived += Number(payment?.amountReceived) || 0;
      totalAllocatedAmount += Number(payment?.allocatedAmount) || 0;
    });
  }

  const difference = totalAmountReceived - totalAllocatedAmount;
  return isNaN(difference) ? 0 : difference;
};

export const calculateTotalOutstandingAmount = (transactions) => {
  let totalOutstanding = 0;

  // Loop through the transactions to sum the outstandingAmount
  transactions.forEach((transaction) => {
    totalOutstanding += transaction.outstandingAmount;
  });

  return totalOutstanding;
};

export const updateColumnHeaders = (columnEnum, columns) => {
  if (columnEnum === 'q') {
    columns.forEach((column) => {
      if (column.field === 'transformDate') {
        column.headerName = 'quaterly';
      }
    });
  } else if (columnEnum === 'd') {
    columns.forEach((column) => {
      if (column.field === 'transformDate') {
        column.headerName = 'daily';
      }
    });
  } else if (columnEnum === 'm') {
    columns.forEach((column) => {
      if (column.field === 'transformDate') {
        column.headerName = 'month';
      }
    });
  } else if (columnEnum === 'y') {
    columns.forEach((column) => {
      if (column.field === 'transformDate') {
        column.headerName = 'yearly';
      }
    });
  }
  return columns;
};

export const transformDateToDayMonth = (list) => {
  list.forEach((item) => {
    const date = new Date(item.month);
    const day = String(date.getDate()).padStart(2, '0');
    const monthShort = date.toLocaleString('en-US', { month: 'short' });

    item.transformDate = `${day}-${monthShort}`;
  });

  return list;
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
};

export const base64ToBlob = (base64: string, mimeType = ''): Blob => {
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
};

export const getMimeTypeFromName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'png':
      return 'image/png';
    case 'jpg':
      return 'image/jpg';
    case 'jpeg':
      return 'image/jpeg';
    case 'txt':
      return 'text/plain';
    case 'csv':
      return 'text/csv';
    case 'zip':
      return 'application/zip';
    default:
      return 'application/octet-stream'; // Fallback for unknown types
  }
};

export const downloadBase64File = (fileDetail: {
  fileContents: string;
  contentType: string;
  fileDownloadName?: string;
}): void => {
  if (!fileDetail?.fileContents) {
    console.error('No file contents found.');
    return;
  }
  const tryDownload = () => {
    const blob = base64ToBlob(fileDetail.fileContents, fileDetail.contentType);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileDetail.fileDownloadName || 'downloadedFile';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  try {
    // If it decodes to JSON, check for errors
    const decoded = atob(fileDetail.fileContents);
    const json = JSON.parse(decoded);
    if (json?.errors?.length) {
      console.error('Download Error:', json.errors[0]?.message);
      // alert('Download failed: ' + json.errors[0]?.message);
      return;
    }
    // Not an error → proceed with download
    tryDownload();
  } catch {
    // Decoding or JSON.parse failed → assume binary and download
    tryDownload();
  }
};

export const clearUploadedDocuments = (uploadedDocs: any[]): void => {
  if (Array.isArray(uploadedDocs)) {
    uploadedDocs.length = 0;
  }
};

export const handleDocumentAction = (
  event: {
    actionName: 'download' | 'previewDoc';
    index?: number;
    rowData: { fileDetails?: FileDetail[] };
  },
  dialogService,
  toasterService
): void => {
  const fileDetail = event.rowData.fileDetails?.[0];

  if (event.actionName === 'download') {
    if (!fileDetail) {
      toasterService.showToaster({
        severity: 'error',
        detail: 'No file found to download.',
      });
      return;
    }
    downloadBase64File(fileDetail);
    return;
  }

  if (event.actionName === 'previewDoc') {
    if (!fileDetail?.fileContents) {
      toasterService.showToaster({
        severity: 'error',
        detail: 'Document not available for preview.',
      });
      return;
    }

    const base64Data = fileDetail.fileContents;
    const contentType = getMimeTypeFromName(fileDetail.fileDownloadName);
    const previewableTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ];

    if (!previewableTypes.includes(contentType)) {
      toasterService.showToaster({
        severity: 'error',
        detail: 'Preview not supported for this file type.',
      });
      return;
    }

    const blob = base64ToBlob(base64Data, contentType);
    const url = URL.createObjectURL(blob);

    dialogService.open(DocumentViewComponent, {
      data: {
        displayDoc: url,
        displayDocType: contentType,
      },
      header: 'Document Preview',
      width: '80%',
      height: '80%',
      contentStyle: { overflow: 'auto' },
    });
  }
};

export const updateDataList = (listDetails, group) => {
  // Step 1: Filter only items with contractId === 0
  let filteredDataList = listDetails?.filter((item) => item.contractId === 0);

  // Step 2: Find the group match and move it to the top
  const emptyFacilityIndex = filteredDataList?.findIndex(
    (item) => item.contractId === 0 && item.facilityType == group
  );

  if (emptyFacilityIndex !== -1) {
    const [emptyFacilityItem] = filteredDataList?.splice(emptyFacilityIndex, 1);
    filteredDataList.unshift(emptyFacilityItem);
  }

  // Step 3: Clear labels for group matches (except the one moved to top)
  filteredDataList.forEach((item) => {
    if (item.facilityType === group) {
      item.facilityName = '';
    }
  });

  // Step 4: Move "Current Account" entries to the end
  const currentAccountItems = filteredDataList.filter(
    (item) => item.facilityType === 'Current Account'
  );
  filteredDataList = filteredDataList.filter(
    (item) => item.facilityType !== 'Current Account'
  );

  return [...filteredDataList, ...currentAccountItems];
};

export const getCurrentAccountLoans = (listDetails) => {
  const filteredDataList = listDetails?.filter(
    (item) => item.contractId !== 0 && item.facilityType == 'Current Account'
  );
  return filteredDataList.map((item) => item.contractId);
};

export const generateSummary = (data) => {
  // Step 1: Separate records
  if (!Array.isArray(data) || data.length === 0) {
    return []; // Return an empty array if data is not present or empty
  }
  const zeroContractRecords = data?.filter((item) => item.contractId === 0);
  const sumRecord = zeroContractRecords.reduce(
    (acc, item) => {
      acc.limit += item.limit || 0;
      acc.currentBalance += item.currentBalance || 0;
      acc.availableFunds += item.availableFunds || 0;
      acc.temporaryLimit += item.temporaryLimit || 0;
      acc.repaymentsAmountDueToday += item.repaymentsAmountDueToday || 0;
      acc.newLoanAmountDueToday += item.newLoanAmountDueToday || 0;
      acc.id = item.id; // last item's id (not sure if needed)
      return acc;
    },
    {
      contractId: 0,
      facilityName: ' ',
      noOfAssets: null,
      limit: 0,
      currentBalance: 0,
      availableFunds: 0,
      temporaryLimit: 0,
      repaymentsAmountDueToday: 0,
      newLoanAmountDueToday: 0,
    }
  );
  zeroContractRecords.unshift(sumRecord);
  // Step 3: Combine summary and remaining records
  return zeroContractRecords;
};

// export const getBuyBackSummaryData = (buybackDetails) => {
//   if (!Array.isArray(buybackDetails) || buybackDetails.length === 0) {
//     return []; // Return an empty array if data is not present or empty
//   }
//   const zeroContractRecords = buybackDetails.filter(
//     (item) => item.contractId === 0
//   );
//   const summaryRecord = zeroContractRecords.reduce(
//     (acc, item) => {
//       acc.limit = item.limit;
//       acc.currentBalance = item.currentBalance;
//       acc.availableFunds = item.availableFunds;
//       acc.id = item.id;
//       return acc;
//     },
//     {
//       contractId: 0,
//       facilityName: ' ',
//       noOfAssets: null,
//       limit: 0,
//       currentBalance: 0,
//       availableFunds: 0,
//       repaymentsAmountDueToday: 0,
//       newLoanAmountDueToday: 0,
//     }
//   );

//   // Filter out all contractId === 0 records from original list
//   const otherRecords = buybackDetails.filter((item) => item.contractId !== 0);

//   const updatedOtherRecords = otherRecords.map((record) => ({
//     ...record,
//     limit: summaryRecord.limit,
//     availableFunds: summaryRecord.availableFunds,
//   }));

//   // Place the summary record at index 0, followed by all other records
//   return [summaryRecord, ...updatedOtherRecords];
// };

export const getBuyBackSummaryData = (buybackDetails) => {
  if (!Array.isArray(buybackDetails) || buybackDetails.length === 0) {
    return [];
  }

  // Step 1: Filter records having contractId = 0
  const zeroContractRecords = buybackDetails.filter(
    (item) => item.contractId === 0
  );

  // Step 2: SUM the numeric fields
  const summaryRecord = zeroContractRecords.reduce(
    (acc, item) => {
      acc.limit += item.limit || 0;
      acc.currentBalance += item.currentBalance || 0;
      acc.availableFunds += item.availableFunds || 0;
      acc.repaymentsAmountDueToday += item.repaymentsAmountDueToday || 0;
      acc.newLoanAmountDueToday += item.newLoanAmountDueToday || 0;
      return acc;
    },
    {
      contractId: 0,
      facilityName: 'Total',
      noOfAssets: null,
      limit: 0,
      currentBalance: 0,
      availableFunds: 0,
      repaymentsAmountDueToday: 0,
      newLoanAmountDueToday: 0,
    }
  );

  // Step 3: Filter other contractId != 0 records
  const otherRecords = buybackDetails.filter((item) => item.contractId !== 0);

  // Step 4: Apply aggregated values to all other records
  const updatedOtherRecords = otherRecords.map((record) => ({
    ...record,
    limit: summaryRecord.limit,
    availableFunds: summaryRecord.availableFunds,
  }));

  // Step 5: Return final result: summary + remaining rows
  return [summaryRecord, ...updatedOtherRecords];
};

export const getMatchingFacilityList = (
  facilityTypeOptionList: any[],
  facilityList: any[],
  selectedFacilityType: string
): any[] => {
  facilityList.forEach((item) => {
    if (item.value === selectedFacilityType) {
      facilityTypeOptionList.push(item);
    }
  });

  return facilityTypeOptionList;
};

export const transformHistoryData = (rawData: any[]): any[] => {
  return rawData.map((item) => {
    // Extract each type of request if available
    const repayment = item.externalData?.repaymentRequest;
    const addAssets = item.externalData?.addAssetsRequest;
    const release = item.externalData?.releaseSecurityRequest;
    const newLoan = item.externalData?.newLoanRequest;
    const drawdown = item.externalData?.drawdownRequest;
    const settlementQuote = item.externalData?.settlementQuoteRequest;
    const sameDayPayout = item.externalData?.assetServiceSameDayPayoutRequest;
    const wholesaleDrawdown = item.externalData?.assetDrawdownRequest;
    const wholesale_repayment =
      item.externalData?.floatingFloorPlanRepaymentRequest;
    const assetDrawdownRequest = item?.subject;
    const assetType = item.externalData?.assetDrawdownRequest?.assetDetails
      ?.singleAsset
      ? getSingleAssetDisplay(item)
      : 'Multiple Assets';
    const totalAmountToPay = sameDayPayout?.assetDetails?.reduce(
      (sum, asset) => {
        const amount = Number(asset?.amountToPay) || 0;
        return sum + amount;
      },
      0
    );

    const baseData = {
      facilityType:
        addAssets?.subFacility ||
        repayment?.subFacility ||
        release?.subFacility ||
        newLoan?.subFacility ||
        drawdown?.subFacility ||
        settlementQuote?.subFacility ||
        sameDayPayout?.subFacility ||
        assetDrawdownRequest?.subFacility ||
        assetDrawdownRequest?.subject ||
        wholesale_repayment?.subFacility ||
        '', // update if needed
      facility:
        repayment?.facilityType ||
        addAssets?.facilityType ||
        release?.facilityType ||
        newLoan?.facilityType ||
        settlementQuote?.facilityType ||
        drawdown?.facilityType ||
        sameDayPayout?.facilityType ||
        wholesale_repayment?.facilityType ||
        '',
      taskId: item.taskId,
      requestType: item?.subject || item.requestType || '', // or item.taskType
      status: item.status || wholesale_repayment?.status || '',
      requestDate:
        item?.startDate ||
        sameDayPayout?.assetDetails?.[0].requestDate ||
        wholesale_repayment?.repaymentDetails?.requestDate ||
        '',
      description:
        repayment?.remarks ||
        addAssets?.assets?.[0]?.assetDescription ||
        release?.assetDetails?.[0]?.assetDescription ||
        newLoan?.disbursementInfo?.assetDetails?.[0]?.assetDescription ||
        settlementQuote?.remarks ||
        drawdown?.disbursementInfo?.assetDetails?.[0]?.assetDescription ||
        sameDayPayout?.assetDetails?.[0]?.assetDescription ||
        // wholesaleDrawdown?.assetDetails?.multipleAsset[0]?.assetDescription ||
        assetType ||
        '',

      amount:
        release?.totalPaymentAmount ||
        (addAssets?.assets?.[0]?.purchasePrice ?? '') ||
        drawdown?.drawdownInfo?.totalDrawdownAmount ||
        totalAmountToPay ||
        wholesale_repayment?.repaymentDetails?.paymentAmount ||
        wholesaleDrawdown?.drawdownDetails?.advanceAmount ||
        '',
      loanNo:
        repayment?.loan ||
        addAssets?.loan ||
        release?.loan ||
        newLoan?.loan ||
        settlementQuote?.loan ||
        drawdown?.loan ||
        '',
      idRef:
        sameDayPayout?.assetDetails[0]?.idRef ||
        wholesaleDrawdown?.assetDetails[0]?.idRef ||
        '',
      assetId:
        sameDayPayout?.assetDetails[0]?.assetId ||
        wholesaleDrawdown?.assetDetails?.singleAsset?.[0]?.assetId ||
        '',
      requestStatus: item?.requestStatus || wholesale_repayment?.status,
      type: wholesaleDrawdown?.type || item?.subject || '',
    };
    return baseData;
  });
};

export const filterByFacilityType = (tasks, facilityType) => {
  if (!Array.isArray(tasks)) {
    console.warn("Expected 'tasks' to be an array, but received:", tasks);
    return [];
  }

  return tasks.filter((task) => {
    const ext = task?.externalData;
    if (!ext) return false;

    const ft = [
      ext.repaymentRequest?.facilityType,
      ext.addAssetsRequest?.facilityType,
      ext.releaseSecurityRequest?.facilityType,
      ext.newLoanRequest?.facilityType,
      ext.drawdownRequest?.facilityType,
      ext.assetServiceSameDayPayoutRequest?.facilityType,
    ].find((v) => v !== undefined);
    return ft === facilityType;
  });
};

export const getUniqueDropdownOptions = (
  tasks: any[],
  key: 'subject' | 'subFacility', // what to return as dropdown values
  facility?: string, // filter by facility
  subFacility?: string // filter by subFacility
): { label: string; value: string }[] => {
  if (!Array.isArray(tasks)) {
    console.warn('Expected an array of tasks, received:', tasks);
    return [];
  }

  const seen = new Set();
  const dropdownOptions: { label: string; value: string }[] = [];

  const facilityLower = facility?.toLowerCase?.();
  const subFacilityLower = subFacility?.toLowerCase?.();

  const filteredTasks = tasks.filter((task) => {
    const fac =
      task.externalData?.repaymentRequest?.facilityType ??
      task.externalData?.addAssetsRequest?.facilityType ??
      task.externalData?.releaseSecurityRequest?.facilityType ??
      task.externalData?.drawdownRequest?.facilityType ??
      task.externalData?.newLoanRequest?.facility ??
      task.externalData?.newLoanRequest?.facilityType ??
      task.externalData?.releaseSecurityRequest?.facility;

    const subFac =
      task.externalData?.repaymentRequest?.subFacility ??
      task.externalData?.addAssetsRequest?.subFacility ??
      task.externalData?.releaseSecurityRequest?.subFacility ??
      task.externalData?.drawdownRequest?.subFacility ??
      task.externalData?.newLoanRequest?.subFacility ??
      task.externalData?.newLoanRequest?.facilityType ??
      task.externalData?.releaseSecurityRequest?.subFacility;

    const matchesFacility = facilityLower
      ? fac?.toLowerCase?.() === facilityLower
      : true;

    const matchesSubFacility = subFacilityLower
      ? subFac?.toLowerCase?.() === subFacilityLower
      : true;

    return matchesFacility && matchesSubFacility;
  });

  filteredTasks.forEach((task) => {
    let value: string | undefined;

    if (key === 'subject') {
      value = task.subject?.trim();
    } else if (key === 'subFacility') {
      value =
        task.externalData?.repaymentRequest?.subFacility ??
        task.externalData?.addAssetsRequest?.subFacility ??
        task.externalData?.releaseSecurityRequest?.subFacility ??
        task.externalData?.drawdownRequest?.subFacility ??
        task.externalData?.newLoanRequest?.subFacility ??
        task.externalData?.newLoanRequest?.facilityType ??
        task.externalData?.releaseSecurityRequest?.subFacility;
    }

    if (value && !seen.has(value)) {
      seen.add(value);
      dropdownOptions.push({ label: value, value: value });
    }
  });

  return dropdownOptions;
};

export const filterByDate = (tasks, from = null, to = null) => {
  if (!Array.isArray(tasks)) return [];

  const parseTime = (val, isEnd = false) => {
    if (!val) return null;
    let t = typeof val === 'string' ? new Date(val) : new Date(val);
    if (typeof val === 'string' && !val.includes('T')) {
      const [y, m, d] = val.split('-').map(Number);
      t = new Date(y, m - 1, d + (isEnd ? 1 : 0));
    }
    return t.getTime();
  };

  const fromTs = parseTime(from);
  const toTs = parseTime(to, true); // exclusive upper bound
  return tasks.filter((task) => {
    const sd = task.startDate;
    if (!sd) return false;
    const ts = parseTime(sd);
    return (fromTs == null || ts >= fromTs) && (toTs == null || ts < toTs);
  });
};

export const filterByCriteria = (
  tasks: any[] = [],
  criteria: {
    facility?: string;
    subFacility?: string;
    requestType?: string;
    fromDate?: string | Date;
    toDate?: string | Date;
  }
): any[] => {
  const { facility, subFacility, requestType, fromDate, toDate } = criteria;
  // Step 1: Filter by date range
  let filteredTasks = filterByDate(tasks, fromDate, toDate);

  // Step 2: Filter by facility (case-insensitive)
  if (facility) {
    const facilityLower = facility.toLowerCase();
    filteredTasks = filteredTasks.filter((task) => {
      const fac =
        task.externalData?.repaymentRequest?.facilityType ??
        task.externalData?.addAssetsRequest?.facilityType ??
        task.externalData?.releaseSecurityRequest?.facilityType ??
        task.externalData?.drawdownRequest?.facilityType ??
        task.externalData?.newLoanRequest?.facilityType;

      return fac?.toLowerCase?.() === facilityLower;
    });
  }

  // Step 3: Filter by subFacility (case-insensitive)
  if (subFacility) {
    const subFacilityLower = subFacility.toLowerCase();
    filteredTasks = filteredTasks.filter((task) => {
      const sf =
        task.externalData?.repaymentRequest?.subFacility ??
        task.externalData?.addAssetsRequest?.subFacility ??
        task.externalData?.releaseSecurityRequest?.subFacility ??
        task.externalData?.drawdownRequest?.subFacility ??
        task.externalData?.newLoanRequest?.subFacility ??
        task.externalData?.newLoanRequest?.facilityType;

      return sf?.toLowerCase?.() === subFacilityLower;
    });
  }

  // Step 4: Filter by requestType
  if (requestType) {
    filteredTasks = filteredTasks.filter(
      (task) => task.subject === requestType
    );
  }

  return filteredTasks;
};

type Sheet = {
  sheetName?: string;
  columns: any[];
  dataList: any[];
  excludedFields?: string[];
  fixedColumnWidth?: any;
};

export const exportWorkbook = (fileName: string, sheets: Sheet | Sheet[]) => {
  const workbook = XLSX.utils.book_new();

  // Normalize sheets input to array
  const sheetsArray = Array.isArray(sheets) ? sheets : [sheets];

  sheetsArray.forEach((sheet) => {
    // Use dataList property for rows
    const worksheet = XLSX.utils.json_to_sheet(sheet.dataList, {
      header: sheet.columns.map((col) => col.field),
    });

    // Replace default headers with translated headers
    const headers = sheet.columns.map((col) => col.headerName);
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

    // Set column widths or default
    if (sheet.fixedColumnWidth) {
      worksheet['!cols'] = sheet.fixedColumnWidth;
    } else {
      worksheet['!cols'] = sheet.columns.map(() => ({ wch: 25 }));
    }

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      sheet.sheetName || 'Sheet1'
    );
  });

  XLSX.writeFile(workbook, fileName);
};

export const formatCurrency = (
  value: number,
  locale = 'en-US',
  currency = 'USD'
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};

export const buildSheetData = ({
  sheetName,
  columns,
  dataList,
  translateService,
  excludedFields = [],
  fixedColumnWidth = 10,
}: {
  sheetName: string;
  columns: any[];
  dataList: any[];
  translateService: any;
  excludedFields?: string[];
  fixedColumnWidth?: number;
}) => {
  const filteredColumns = columns
    .filter(
      (col) =>
        !excludedFields.includes(col.headerName) &&
        !excludedFields.includes(col.field)
    )
    .map((col) => ({
      ...col,
      headerName: translateService.instant(col.headerName),
    }));

  const cleanedData = dataList.map((row) => {
    const newRow = {};
    filteredColumns.forEach((col) => {
      let value = row[col.field];

      if (col.format === '#currency' && typeof value === 'number') {
        newRow[col.field] = formatCurrency(value);
      } else if (col.format === '#date' && typeof value === 'string') {
        // Parse #date(YYYY,MM,DD) format
        newRow[col.field] = transformSlashDate(value);
      } else {
        newRow[col.field] = value;
      }
    });
    return newRow;
  });

  const columnWidths = filteredColumns.map(() => ({ wch: fixedColumnWidth }));

  return {
    sheetName,
    columns: filteredColumns,
    dataList: cleanedData,
    columnWidths,
  };
};

export const extractSubjectValue = (subject: string): string => {
  if (!subject) return '';
  const match = subject.match(/^CSSPORTAL_(.*?)_\[\d+\]$/);
  return match && match[1] ? match[1] : '';
};

export const cleanDataList = (columns, dataList) => {
  const includedFields = columns.map((col) => col.field);

  return dataList.map((row) => {
    const filteredRow = {};
    includedFields.forEach((field) => {
      if (field in row) {
        filteredRow[field] = row[field];
      }
    });
    return filteredRow;
  });
};

export const mapRowsWithCaptions = (datasets, records) => {
  // Normalize datasets into a flat list of fields
  const fields = Array.isArray(datasets)
    ? datasets.flatMap((item) => item.fields ?? item) // handles both formats
    : [];

  // Create a map of field name → caption
  const fieldMap = fields.reduce((acc, field) => {
    if (field?.name && field?.caption) {
      acc[field.name] = field.caption;
    }
    return acc;
  }, {});

  // Map each record to a row object with caption as key
  return records.map((record) => {
    return record.values.reduce((row, value) => {
      const caption = fieldMap[value.name];
      if (caption) {
        row[caption] = value.displayValue;
      }
      return row;
    }, {});
  });
};

export const generateColumnDefs = (
  rowData: any[],
  fieldDefinitionArray:
    | {
        fields: { name: string; caption: string; dataType: string }[];
      }[]
    | { name: string; caption: string; dataType: string }[]
) => {
  const allKeys = new Set<string>();

  // Step 1: Collect all keys from rowData
  rowData.forEach((row) => {
    Object.keys(row).forEach((key) => allKeys.add(key));
  });

  // Step 2: Flatten the fieldDefinitionArray into a list of fields regardless of shape
  let flatFields: { name: string; caption: string; dataType: string }[] = [];

  if (fieldDefinitionArray.length > 0) {
    // Check if first element has 'fields' property → nested
    if ('fields' in fieldDefinitionArray[0]) {
      // nested structure
      (fieldDefinitionArray as { fields: any[] }[]).forEach((def) => {
        flatFields = flatFields.concat(def.fields);
      });
    } else {
      // flat structure
      flatFields = fieldDefinitionArray as {
        name: string;
        caption: string;
        dataType: string;
      }[];
    }
  }

  // Step 3: Create a map from caption to caption & dataType
  const fieldMap: Record<string, { caption: string; dataType: string }> = {};
  flatFields.forEach((field) => {
    fieldMap[field.caption] = {
      caption: field.caption,
      dataType: field.dataType,
    };
  });

  // Step 4: Build column definitions
  return Array.from(allKeys).map((key) => {
    const fieldInfo = fieldMap[key];

    const colDef: any = {
      field: key,
      headerName: fieldInfo?.caption || key,
    };

    if (fieldInfo?.dataType === 'DateTime') {
      colDef.format = '#date';
    }
    if (fieldInfo?.dataType === 'Amount' || fieldInfo?.dataType === 'Decimal') {
      colDef.format = '#currency';
    }

    if (
      fieldInfo?.caption === 'Transfer Request No.' ||
      fieldInfo?.caption === 'Request No.'
    ) {
      colDef.action = 'onCellClick';
      colDef.class = 'text-primary';
    }

    return colDef;
  });
};

export const removeSimpleActionColumn = (columns) =>
  columns.filter(
    (col) =>
      !(
        col.field === 'action' &&
        col.headerName === 'action' &&
        Object.keys(col).length === 2
      )
  );

export const mapAttachments = (data) =>
  Array.isArray(data?.attachments)
    ? data.attachments.map((att) => ({
        fileName: att.fileName,
        id: att.id,
        noteId: att.noteId,
        securityClassification: data.securityClassification,
        loadedBy: data.userName,
        type: data.activityType,
        loadedOn: data.activityDt,
        category: data.activityArea,
      }))
    : [];

export const base64ToFormData = (
  base64Str: string,
  fileName: string = 'file',
  fileType: string = 'png' // e.g., 'png', 'pdf', etc.
) => {
  // Ensure fileName has extension
  const finalFileName = fileName.includes('.')
    ? fileName
    : `${fileName}.${fileType}`;

  // Get MIME type from filename
  const mime = getMimeTypeFromName(finalFileName);

  // Decode base64
  const byteString = atob(base64Str);
  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  // Create blob and append to FormData
  const blob = new Blob([byteArray], { type: mime });
  const formData = new FormData();
  formData.append('file', blob, finalFileName);
  return formData;
};

export const base64ToBytes = (base64: string): Uint8Array => {
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  const binaryStr = atob(base64Data);
  const len = binaryStr.length;

  // Safe ArrayBuffer (not SharedArrayBuffer)
  const buffer = new ArrayBuffer(len);
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  //Force type: treat as Blob-compatible Uint8Array
  return bytes as Uint8Array & { buffer: ArrayBuffer };
};

export const filterWholesaleTaskRequestHistoryData = (
  data: any[],
  selectedFacilityType,
  selectedType: string
) => {
  const isCompleted = selectedType === 'Completed';
  return (
    data
      // Step 1: Filter by facilityType from nested externalData
      .filter((item) => {
        const facilityType =
          item.externalData?.floatingFloorPlanRepaymentRequest?.facilityType ||
          item.externalData?.assetServiceSameDayPayoutRequest?.facilityType ||
          item.externalData?.assetDrawdownRequest?.facilityType;
        return facilityType === selectedFacilityType;
      })

      // Step 2: Name filter only for FixedFloorPlan_Group
      .filter((item) => {
        const facilityType =
          item.externalData?.floatingFloorPlanRepaymentRequest?.facilityType;
        if (facilityType === FacilityType.FixedFloorPlan_Group) {
          return wholesale_Floating_Floor_Requests.includes(item.subject);
        }
        return true; // no subject filter for Bailment
      })

      // Step 3: Bailment-specific status filtering and requestStatus mapping
      .map((item) => {
        const facilityType =
          item.externalData?.floatingFloorPlanRepaymentRequest?.facilityType;

        if (facilityType === FacilityType.Bailment_Group) {
          const shouldInclude = isCompleted
            ? item.status === 'Completed'
            : item.status !== 'Completed';

          if (!shouldInclude) return null;

          return {
            ...item,
            requestStatus: isCompleted
              ? 'Same Day Payout Completed'
              : 'Same Day Payout Pending',
          };
        }

        // For FixedFloorPlan_Group or others — no status filter or mapping
        return item;
      })

      // Step 4: Remove nulls (filtered-out Bailment items)
      .filter(Boolean)
  );
};

export const printTable = (
  columnDefs: any[],
  rowData: any[],
  translateService: any,
  orientation: 'portrait' | 'landscape' = 'landscape'
) => {
  //default ignore list add more later
  const ignoreFields = [
    'action',
    'actions',
    'paymentDetails',
    'allocatedDetails',
  ];

  // Filter columns dynamically
  const filteredCols = columnDefs.filter(
    (col) => !ignoreFields.includes(col.field)
  );

  let tableHTML =
    '<table border="1" cellpadding="3" cellspacing="0" style="border-collapse: collapse; width: 100%;">';

  // Header
  tableHTML += '<thead><tr style="background-color: #f0f0f0;">';
  filteredCols.forEach((col) => {
    const headerText = col.headerName
      ? translateService.instant(col.headerName)
      : col.field;

    tableHTML += `<th style="border: 1px solid #000; padding: 4px; font-size: 9px; font-weight: bold;">${headerText}</th>`;
  });
  tableHTML += '</tr></thead>';

  // Body
  tableHTML += '<tbody>';
  rowData.forEach((row) => {
    tableHTML += '<tr>';

    filteredCols.forEach((col) => {
      const value =
        row[col.field] !== null && row[col.field] !== undefined
          ? row[col.field]
          : '';

      tableHTML += `<td style="border: 1px solid #000; padding: 4px; font-size: 8px;">${value}</td>`;
    });

    tableHTML += '</tr>';
  });
  tableHTML += '</tbody></table>';

  // iframe (rest of your existing code)...
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';

  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow!.document;

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print</title>
        <style>
          @page {
            size: ${orientation};
            margin: 5mm;
          }
          body { font-family: Arial, sans-serif; padding: 5px; }
          table { border-collapse: collapse; width: 100%; table-layout: fixed; }
          th, td { border: 1px solid #000; padding: 4px; word-wrap: break-word; }
          th { background-color: #f0f0f0; font-weight: bold; font-size: 9px;}
          td { font-size: 8px; }
          thead { display: table-header-group; }
        </style>
      </head>
      <body>${tableHTML}</body>
    </html>
  `);
  iframeDoc.close();

  setTimeout(() => {
    iframe.contentWindow!.focus();
    iframe.contentWindow!.print();
    setTimeout(() => document.body.removeChild(iframe), 100);
  }, 250);
};

export const printMultipleTables = (
  paymentColumnDefs: any[],
  accountColumnDefs: any[],
  paymentData: any[],
  accountData: any[],
  translateService: any,
  orientation: 'portrait' | 'landscape' = 'portrait'
) => {
  const paymentTableHTML = generateForecastTableHTML(
    paymentColumnDefs,
    paymentData,
    '',
    translateService
  );

  const accountTableHTML = generateForecastTableHTML(
    accountColumnDefs,
    accountData,
    '',
    translateService
  );

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow!.document;

  // Write markup
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print</title>
        <style>
          @page { size: ${orientation}; margin: 10mm; }

          body { font-family: Arial, sans-serif; padding: 10px; }

          .table-container {
            page-break-after: always;
            margin-bottom: 20px;
          }

          .table-container:last-child { page-break-after: auto; }

          .table-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            table-layout: auto;
            margin-bottom: 20px;
          }

          th, td {
            border: 1px solid #000;
            padding: 6px;
            word-wrap: break-word;
          }

          th {
            background-color: #f0f0f0 !important;
            font-weight: bold;
            font-size: 10px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          td { font-size: 9px; }

          thead { display: table-header-group; }
        </style>
      </head>
      <body>
        ${paymentTableHTML}
        ${accountTableHTML}
      </body>
    </html>
  `);

  iframeDoc.close();

  // Print
  setTimeout(() => {
    iframe.contentWindow!.focus();
    iframe.contentWindow!.print();
    setTimeout(() => document.body.removeChild(iframe), 100);
  }, 250);
};

export const generateForecastTableHTML = (
  columnDefs: any[],
  dataList: any[],
  tableTitle: string,
  translateService: any
): string => {
  // internal fields to ignore
  const ignoreFields = [
    'action',
    'actions',
    'paymentDetails',
    'allocatedDetails',
  ];

  if (!Array.isArray(columnDefs) || columnDefs.length === 0) {
    return `
      <div class="table-container">
        <div class="table-title">${tableTitle}</div>
        <p>No column definitions available.</p>
      </div>`;
  }

  if (!Array.isArray(dataList)) {
    dataList = [];
  }

  // Filter out ignored fields
  const filteredCols = columnDefs.filter(
    (col) => !ignoreFields.includes(col.field)
  );

  let tableHTML = `<div class="table-container">`;

  // Title
  tableHTML += `<div class="table-title">${tableTitle}</div>`;

  tableHTML += `<table border="1" cellpadding="6" cellspacing="0">`;

  // Headers
  tableHTML += `<thead><tr>`;

  filteredCols.forEach((col) => {
    const headerText = col.headerName
      ? translateService.instant(col.headerName)
      : col.field;

    tableHTML += `<th>${headerText}</th>`;
  });

  tableHTML += `</tr></thead>`;

  // Rows
  tableHTML += `<tbody>`;

  if (dataList.length === 0) {
    tableHTML += `
      <tr>
        <td colspan="${filteredCols.length}" style="text-align:center;">
          No data available
        </td>
      </tr>`;
  } else {
    dataList.forEach((row) => {
      tableHTML += '<tr>';

      filteredCols.forEach((col) => {
        const value =
          row[col.field] !== null && row[col.field] !== undefined
            ? row[col.field]
            : '';

        tableHTML += `<td>${value}</td>`;
      });

      tableHTML += '</tr>';
    });
  }

  tableHTML += `</tbody></table></div>`;
  return tableHTML;
};
export const getSingleAssetDisplay = (item) => {
  const asset =
    item?.externalData?.assetDrawdownRequest?.assetDetails?.singleAsset?.[0];

  if (!asset) return '';

  const { make, model, year, vin, regoNo } = asset;

  const id = vin || regoNo || '';

  // Build the display string just like your pattern
  return [make, model, year, id].filter((x) => x).join(' ');
};

export const clearSession = (keys?: string | string[]): void => {
  if (!keys) {
    // Clear entire session
    sessionStorage.clear();
    return;
  }

  if (typeof keys === 'string') {
    sessionStorage.removeItem(keys);
    return;
  }

  if (Array.isArray(keys)) {
    keys.forEach((key) => sessionStorage.removeItem(key));
  }
};
