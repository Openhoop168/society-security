'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  dataType: 'salary' | 'city'
  status?: string
}

export function FileUploader({ onFileSelect, dataType, status }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const excelFile = files.find((file) =>
        file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
      )

      if (excelFile) {
        setSelectedFile(excelFile)
        onFileSelect(excelFile)
      } else {
        alert('请上传 Excel 文件 (.xlsx 或 .xls)')
      }
    },
    [onFileSelect]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setSelectedFile(file)
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const downloadTemplate = () => {
    // 创建模板数据
    let templateData: any[] = []
    let filename = ''

    if (dataType === 'salary') {
      filename = '工资数据模板.xlsx'
      templateData = [
        {
          '员工工号': 'E001',
          '员工姓名': '张三',
          '年月份': 202501,
          '工资金额': 8000,
          '部门': '技术部',
          '职位': '工程师',
        },
        {
          '员工工号': 'E002',
          '员工姓名': '李四',
          '年月份': 202501,
          '工资金额': 9000,
          '部门': '销售部',
          '职位': '销售经理',
        },
      ]
    } else {
      filename = '城市标准模板.xlsx'
      templateData = [
        {
          '城市名称': '佛山',
          '年份': 2025,
          '基数下限': 3958,
          '基数上限': 21051,
          '养老公司比例': 0.14,
          '养老个人比例': 0.08,
          '医疗公司比例': 0.045,
          '医疗个人比例': 0.02,
          '失业公司比例': 0.008,
          '失业个人比例': 0.002,
          '工伤公司比例': 0.02,
          '生育公司比例': 0.01,
          '公积金公司比例': 0.05,
          '公积金个人比例': 0.05,
        },
      ]
    }

    // 动态导入 xlsx
    import('xlsx').then((XLSX) => {
      const ws = XLSX.utils.json_to_sheet(templateData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      XLSX.writeFile(wb, filename)
    })
  }

  const getDataTypeLabel = () => {
    return dataType === 'salary' ? '员工工资数据' : '城市社保标准'
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* 上传区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <h2 className="text-lg font-semibold text-nbs-primary mb-2">
          上传{getDataTypeLabel()}
        </h2>
        <p className="text-sm text-neutral-500 mb-6">
          支持 Excel (.xlsx, .xls) 格式，单次最多上传 1000 条数据
        </p>

        {/* 拖拽上传区域 */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            isDragging
              ? 'border-nbs-primary bg-nbs-primary/5'
              : 'border-neutral-300 hover:border-nbs-primary/50 hover:bg-nbs-primary/5'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".xlsx,.xls"
            onChange={handleFileInput}
          />

          <div className="pointer-events-none">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-nbs-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-neutral-700 mb-2">
              {isDragging ? '释放文件以上传' : '拖拽文件到这里'}
            </p>
            <p className="text-sm text-neutral-500 mb-4">或者</p>
            <Button type="button" className="pointer-events-auto">
              选择文件
            </Button>
          </div>
        </div>

        {/* 状态信息 */}
        {status && (
          <div className="mt-4 p-4 bg-nbs-primary/10 rounded-lg">
            <p className={`text-sm ${status.includes('失败') || status.includes('错误') ? 'text-red-600' : 'text-nbs-primary'}`}>
              {status}
            </p>
          </div>
        )}

        {/* 选中的文件 */}
        {selectedFile && !status && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-neutral-700">{selectedFile.name}</p>
                <p className="text-xs text-neutral-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 模板下载 */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-md font-semibold text-nbs-primary mb-3">没有数据文件？</h3>
        <p className="text-sm text-neutral-600 mb-4">
          下载 Excel 模板，按照格式填写数据后再上传
        </p>
        <Button variant="outline" onClick={downloadTemplate} className="w-full">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载{getDataTypeLabel()}模板
        </Button>
      </div>

      {/* 数据格式说明 */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-md font-semibold text-nbs-primary mb-3">数据格式说明</h3>
        <div className="text-sm text-neutral-600 space-y-2">
          {dataType === 'salary' ? (
            <>
              <p><strong>员工工号:</strong> 必填，员工唯一编号</p>
              <p><strong>员工姓名:</strong> 必填，员工真实姓名</p>
              <p><strong>年月份:</strong> 必填，格式 YYYYMM（如 202501）</p>
              <p><strong>工资金额:</strong> 必填，税前工资（元）</p>
              <p><strong>部门:</strong> 可选，员工所属部门</p>
              <p><strong>职位:</strong> 可选，员工职位名称</p>
            </>
          ) : (
            <>
              <p><strong>城市名称:</strong> 必填，如"佛山"</p>
              <p><strong>年份:</strong> 必填，如 2025</p>
              <p><strong>基数下限:</strong> 必填，社保缴费基数下限</p>
              <p><strong>基数上限:</strong> 必填，社保缴费基数上限</p>
              <p><strong>各项比例:</strong> 必填，缴费比例（0.14 表示 14%）</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
