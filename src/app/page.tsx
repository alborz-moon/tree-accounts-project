'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  ContentCut,
  ContentCopy,
  ContentPaste,
  Delete,
  Add,
  ExpandMore,
  ChevronLeft,
} from '@mui/icons-material';

interface TreeNode {
  id: string;
  code: string;
  label: string;
  children?: TreeNode[];
}

interface Clipboard {
  nodes: TreeNode[];
  mode: 'cut' | 'copy';
}

const initialData: TreeNode[] = [
  {
    id: '1',
    code: '1',
    label: 'دارایی های جاری',
    children: [
      {
        id: '1-1',
        code: '1-1',
        label: 'وجوه نقد',
        children: [
          { id: '1-1-1', code: '1-1-1', label: 'تن خواه' },
          { id: '1-1-2', code: '1-1-2', label: 'بانک' },
        ],
      },
      {
        id: '1-3',
        code: '1-3',
        label: 'حساب های دریافتنی',
        children: [
          { id: '1-3-1', code: '1-3-1', label: 'حساب های دریافتنی حامی کت' },
        ],
      },
    ],
  },
  {
    id: '2',
    code: '2',
    label: 'دارایی های غیر جاری',
  },
  {
    id: '3',
    code: '3',
    label: 'بدهی های جاری',
    children: [
      {
        id: '3-1',
        code: '3-1',
        label: 'حسابهای پرداختنی تجاری',
        children: [
          { id: '3-1-1', code: '3-1-1', label: 'کیف پول پرداختنی خریدار' },
          { id: '3-1-2', code: '3-1-2', label: 'حساب های پرداختنی فروشگاه' },
          { id: '3-1-3', code: '3-1-3', label: 'حساب های پرداختنی فروشنده' },
          { id: '3-1-4', code: '3-1-4', label: 'حساب های پرداختنی پیک' },
        ],
      },
      {
        id: '3-4',
        code: '3-4',
        label: 'حسابهای پرداختنی غیر تجاری',
        children: [
          { id: '3-4-1', code: '3-4-1', label: 'مالیات پرداختنی' },
          { id: '3-4-2', code: '3-4-2', label: 'بیمه پرداختنی' },
          { id: '3-4-3', code: '3-4-3', label: 'ارزش افزوده پرداختنی' },
          { id: '3-4-4', code: '3-4-4', label: 'تامین کننده هزینه' },
          { id: '3-4-5', code: '3-4-5', label: 'حقوق پرداختنی' },
        ],
      },
    ],
  },
  {
    id: '4',
    code: '4',
    label: 'بدهی های غیر جاری',
  },
  {
    id: '5',
    code: '5',
    label: 'حقوق صاحبان سهام (سرمایه)',
  },
  {
    id: '6',
    code: '6',
    label: 'درآمد',
    children: [
      {
        id: '6-1',
        code: '6-1',
        label: 'درآمدهای عملیاتی',
        children: [
          { id: '6-1-1', code: '6-1-1', label: 'درآمد سفر ( رفت به فروشگاه)' },
          { id: '6-1-2', code: '6-1-2', label: 'درآمد سفر ( رفت به خریدار)' },
          { id: '6-1-3', code: '6-1-3', label: 'درآمد سفر ( برگشت به فروشگاه)' },
          { id: '6-1-4', code: '6-1-4', label: 'درآمد سفر (رفت به انبار)' },
          { id: '6-1-5', code: '6-1-5', label: 'درآمد سفر (رفت از انبار به فروشگاه)' },
          { id: '6-1-6', code: '6-1-6', label: 'درآمد سفر (رفت از انبار به خریدار)' },
        ],
      },
      {
        id: '6-2',
        code: '6-2',
        label: 'درآمدهای غیرعملیاتی',
      },
    ],
  },
  {
    id: '7',
    code: '7',
    label: 'قیمت تمام شده',
  },
  {
    id: '8',
    code: '8',
    label: 'هزینه ها',
  },
  {
    id: '9',
    code: '9',
    label: 'حساب های انتظامی',
    children: [
      {
        id: '9-1',
        code: '9-1',
        label: 'حساب های انتظامی سایر',
        children: [
          { id: '9-1-1', code: '9-1-1', label: 'سفر تحویل از فروشگاه' },
          { id: '9-1-2', code: '9-1-2', label: 'سفر تحویل از خریدار' },
          { id: '9-1-3', code: '9-1-3', label: 'سفر تحویل از انبار' },
        ],
      },
      {
        id: '9-2',
        code: '9-2',
        label: 'حساب های انتظامی فروشگاه',
        children: [
          { id: '9-2-1', code: '9-2-1', label: 'تحویل به سفیر' },
          { id: '9-2-2', code: '9-2-2', label: 'تحویل از خریدار' },
        ],
      },
      {
        id: '9-3',
        code: '9-3',
        label: 'حساب های انتظامی انبار',
        children: [
          { id: '9-3-1', code: '9-3-1', label: 'تحویل از سفیر' },
        ],
      },
    ],
  },
];

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function findNode(
  nodes: TreeNode[],
  id: string,
  parent: TreeNode | null = null
): { node: TreeNode; parent: TreeNode | null; index: number } | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return { node: nodes[i], parent, index: i };
    }
    if (nodes[i].children) {
      const found = findNode(nodes[i].children!, id, nodes[i]);
      if (found) return found;
    }
  }
  return null;
}

function generateId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function updateCodes(nodes: TreeNode[], parentCode: string = ''): TreeNode[] {
  return nodes.map((node, index) => {
    const code = parentCode ? `${parentCode}-${index + 1}` : `${index + 1}`;
    return {
      ...node,
      code,
      children: node.children ? updateCodes(node.children, code) : undefined,
    };
  });
}

function regenIds(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((n) => ({
    ...n,
    id: generateId(),
    children: n.children ? regenIds(n.children) : undefined,
  }));
}

export default function Home() {
  const [tree, setTree] = useState<TreeNode[]>(initialData);
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(['1', '1-1', '3', '3-1', '3-4', '6', '6-1', '9', '9-1', '9-2', '9-3'])
  );
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    nodeId: string;
  } | null>(null);
  const [clipboard, setClipboard] = useState<Clipboard | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addParentId, setAddParentId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent, nodeId: string) => {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
        nodeId,
      });
      setSelectedId(nodeId);
    },
    []
  );

  const handleCloseContextMenu = () => setContextMenu(null);

  const getNodeInfo = useCallback(
    (id: string) => findNode(tree, id),
    [tree]
  );

  const handleCut = () => {
    if (!contextMenu) return;
    const info = getNodeInfo(contextMenu.nodeId);
    if (!info) return;
    if (info.node.children && info.node.children.length > 0) {
      alert('فقط نودهایی که فرزند ندارند قابل برش هستند.');
      handleCloseContextMenu();
      return;
    }
    setClipboard({ nodes: [deepClone(info.node)], mode: 'cut' });
    setTree((prev) => {
      const newTree = deepClone(prev);
      const found = findNode(newTree, contextMenu.nodeId);
      if (found) {
        if (found.parent) {
          found.parent.children = found.parent.children!.filter(
            (_, i) => i !== found.index
          );
          if (found.parent.children!.length === 0) delete found.parent.children;
        } else {
          newTree.splice(found.index, 1);
        }
      }
      return updateCodes(newTree);
    });
    handleCloseContextMenu();
  };

  const handleCopy = () => {
    if (!contextMenu) return;
    const info = getNodeInfo(contextMenu.nodeId);
    if (!info) return;
    setClipboard({ nodes: [deepClone(info.node)], mode: 'copy' });
    handleCloseContextMenu();
  };

  const handlePaste = () => {
    if (!contextMenu || !clipboard) return;
    setTree((prev) => {
      const newTree = deepClone(prev);
      const found = findNode(newTree, contextMenu.nodeId);
      if (!found) return prev;
      const nodesToPaste = regenIds(deepClone(clipboard.nodes));
      if (!found.node.children) found.node.children = [];
      found.node.children.push(...nodesToPaste);
      return updateCodes(newTree);
    });
    if (clipboard.mode === 'cut') setClipboard(null);
    setExpanded((prev) => new Set(prev).add(contextMenu.nodeId));
    handleCloseContextMenu();
  };

  const handleDelete = () => {
    if (!contextMenu) return;
    const info = getNodeInfo(contextMenu.nodeId);
    if (!info) return;
    if (info.node.children && info.node.children.length > 0) {
      alert('فقط نودهایی که فرزند ندارند قابل حذف هستند.');
      handleCloseContextMenu();
      return;
    }
    setTree((prev) => {
      const newTree = deepClone(prev);
      const found = findNode(newTree, contextMenu.nodeId);
      if (found) {
        if (found.parent) {
          found.parent.children = found.parent.children!.filter(
            (_, i) => i !== found.index
          );
          if (found.parent.children!.length === 0) delete found.parent.children;
        } else {
          newTree.splice(found.index, 1);
        }
      }
      return updateCodes(newTree);
    });
    handleCloseContextMenu();
  };

  const handleAddSub = () => {
    if (!contextMenu) return;
    setAddParentId(contextMenu.nodeId);
    setNewLabel('');
    setAddDialogOpen(true);
    handleCloseContextMenu();
  };

  const confirmAdd = () => {
    if (!addParentId || !newLabel.trim()) return;
    setTree((prev) => {
      const newTree = deepClone(prev);
      const found = findNode(newTree, addParentId);
      if (!found) return prev;
      if (!found.node.children) found.node.children = [];
      found.node.children.push({
        id: generateId(),
        code: '',
        label: newLabel.trim(),
      });
      return updateCodes(newTree);
    });
    setExpanded((prev) => new Set(prev).add(addParentId));
    setAddDialogOpen(false);
    setNewLabel('');
    setAddParentId(null);
  };

  const TreeNodeItem = ({ node, depth = 0 }: { node: TreeNode; depth?: number }) => {
    const hasChildren = !!(node.children && node.children.length > 0);
    const isExpanded = expanded.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <Box key={node.id} sx={{ mb: 0.5 }}>
        <Paper
          elevation={isSelected ? 3 : 1}
          onContextMenu={(e) => handleContextMenu(e, node.id)}
          onClick={() => setSelectedId(node.id)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.8,
            ml: depth * 3,
            cursor: 'pointer',
            border: '1px solid',
            borderColor: isSelected ? 'primary.main' : '#e0c0c0',
            borderRadius: 2,
            backgroundColor: isSelected ? '#fce8e8' : '#fff',
            '&:hover': {
              backgroundColor: '#fdf5f5',
              borderColor: 'primary.light',
            },
            transition: 'all 0.15s',
            minWidth: 220,
            maxWidth: 360,
          }}
        >
          {hasChildren ? (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle(node.id);
              }}
              sx={{ p: 0.3, mr: 0.5 }}
            >
              {isExpanded ? (
                <ExpandMore fontSize="small" color="primary" />
              ) : (
                <ChevronLeft fontSize="small" color="primary" />
              )}
            </IconButton>
          ) : (
            <Box sx={{ width: 28 }} />
          )}
          <Typography
            variant="body2"
            sx={{
              fontWeight: hasChildren ? 600 : 400,
              color: '#5a2a2a',
              flex: 1,
              textAlign: 'right',
              direction: 'rtl',
            }}
          >
            {node.code} {node.label}
          </Typography>
        </Paper>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ position: 'relative' }}>
              {node.children!.map((child) => (
                <TreeNodeItem key={child.id} node={child} depth={depth + 1} />
              ))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  const selectedInfo = contextMenu ? getNodeInfo(contextMenu.nodeId) : null;
  const canCutOrDelete =
    selectedInfo &&
    (!selectedInfo.node.children || selectedInfo.node.children.length === 0);
  const canPaste = !!clipboard;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#faf7f7',
        p: 3,
        direction: 'rtl',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: '#8b3a3a',
          textAlign: 'center',
        }}
      >
        حساب های اصلی
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        <Paper
          sx={{
            px: 2,
            py: 1,
            mb: 2,
            backgroundColor: '#c45c5c',
            color: '#fff',
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          حساب های اصلی
        </Paper>

        {tree.map((node) => (
          <TreeNodeItem key={node.id} node={node} depth={0} />
        ))}
      </Box>

      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleCut} disabled={!canCutOrDelete}>
          <ListItemIcon>
            <ContentCut fontSize="small" />
          </ListItemIcon>
          <ListItemText>برش دادن</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCopy}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>کپی کردن</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePaste} disabled={!canPaste}>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>پیست کردن</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} disabled={!canCutOrDelete}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>حذف</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAddSub}>
          <ListItemIcon>
            <Add fontSize="small" />
          </ListItemIcon>
          <ListItemText>افزودن زیرشاخه</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        PaperProps={{ sx: { minWidth: 360 } }}
      >
        <DialogTitle sx={{ textAlign: 'right' }}>افزودن زیرشاخه</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="برچسب نود (Label)"
            fullWidth
            variant="outlined"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmAdd();
            }}
            sx={{ mt: 1 }}
            inputProps={{ style: { textAlign: 'right', direction: 'rtl' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-start' }}>
          <Button onClick={() => setAddDialogOpen(false)} color="inherit">
            انصراف
          </Button>
          <Button
            onClick={confirmAdd}
            variant="contained"
            disabled={!newLabel.trim()}
          >
            افزودن
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
