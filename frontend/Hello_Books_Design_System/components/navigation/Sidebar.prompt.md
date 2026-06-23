Fixed left navigation shell — brand block at top, `SidebarItem`s in the middle, logged-in user card at the bottom. 292px wide.

```jsx
<Sidebar subtitle="Central Library" user={{ name: "Marina Costa", role: "Head Librarian" }}>
  <SidebarItem icon={<LayoutGrid size={18}/>} label="Dashboard" active />
  <SidebarItem icon={<BookOpen size={18}/>} label="Catálogo" />
  <SidebarItem icon={<Users size={18}/>} label="Membros" />
</Sidebar>
```
