Dashboard metric card — icon chip, big number, label, optional delta. Use semantic `tone` for alert metrics.

```jsx
<MetricCard icon={<BookOpen size={22}/>} label="Total de Livros" value="12.480" delta="+3%" />
<MetricCard icon={<AlertCircle size={22}/>} label="Devoluções Atrasadas" value="38" delta="+5" deltaTone="danger" tone="danger" />
```

Grid these 3–4 across at the top of a dashboard.
