import { Info } from 'lucide-react'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

const InfoTooltip = ({ content }: { content: string }) => {
  return (
   <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default InfoTooltip